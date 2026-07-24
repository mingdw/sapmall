import {
  BaseError,
  encodeFunctionData,
  type Abi,
  type Address,
  type Chain,
  type Hash,
  type Hex,
  type WalletClient,
} from 'viem';
import { startCctpPerf } from './cctpPerfLog';

type ContractCall = {
  to: Address;
  abi: Abi;
  functionName: string;
  args: readonly unknown[];
  /** 固定 Gas Limit（传入后跳过钱包自动估算，加速弹窗） */
  gas?: bigint;
};

type WriteContractArgs = Parameters<WalletClient['writeContract']>[0];

async function writeOne(
  walletClient: WalletClient,
  account: Address,
  chain: Chain,
  call: ContractCall,
): Promise<Hash> {
  // Address 可直接作为 account，勿强转为 Account（会触发 TS2352）
  const hash = await walletClient.writeContract({
    account,
    chain,
    address: call.to,
    abi: call.abi,
    functionName: call.functionName,
    args: call.args,
    ...(call.gas ? { gas: call.gas } : {}),
  } as WriteContractArgs);
  return hash;
}

function errorMessage(err: unknown): string {
  if (err instanceof BaseError) return `${err.shortMessage} ${err.message}`;
  if (err instanceof Error) return err.message;
  return String(err);
}

function isUserRejected(err: unknown): boolean {
  const msg = errorMessage(err).toLowerCase();
  return msg.includes('user rejected') || msg.includes('user denied') || msg.includes('rejected the request');
}

function isBatchUnsupportedError(err: unknown): boolean {
  return /sendCalls|wallet_sendCalls|atomic|not supported|method not found|does not exist|capability|5792|unknown method/i.test(
    errorMessage(err),
  );
}

/**
 * 把 approve + 业务交易合并为尽可能「一次钱包确认」。
 * - 优先 EIP-5792 wallet_sendCalls（支持时源链/目标链各 1 次弹窗）
 * - 不支持时回退顺序发交易（仍会是 2 次确认）
 */
export async function sendContractCallsBatched(params: {
  walletClient: WalletClient;
  account: Address;
  chain: Chain;
  calls: ContractCall[];
}): Promise<{ hashes: Hash[]; primaryHash: Hash }> {
  const { walletClient, account, chain, calls } = params;
  const perf = startCctpPerf('sendContractCallsBatched', {
    chainId: chain.id,
    chainName: chain.name,
    callCount: calls.length,
    functions: calls.map((c) => c.functionName),
  });

  if (calls.length === 0) {
    throw new Error('无交易可发送');
  }

  if (calls.length === 1) {
    perf.mark('writeContract:requestWalletPopup', {
      functionName: calls[0].functionName,
      note: '单笔交易，即将唤起钱包',
    });
    const hash = await writeOne(walletClient, account, chain, calls[0]);
    perf.done('ok-single', { hash: hash.slice(0, 10) });
    return { hashes: [hash], primaryHash: hash };
  }

  try {
    if (typeof walletClient.sendCalls !== 'function' || typeof walletClient.waitForCallsStatus !== 'function') {
      throw new Error('wallet 不支持 sendCalls');
    }

    const encodedCalls = calls.map((call) => ({
      to: call.to,
      data: encodeFunctionData({
        abi: call.abi,
        functionName: call.functionName,
        args: call.args,
      }),
    }));

    const trySend = async (forceAtomic: boolean) => {
      perf.mark('sendCalls:requestWalletPopup', {
        forceAtomic,
        note: 'EIP-5792 批量，即将唤起钱包',
      });
      const res = await walletClient.sendCalls({
        account,
        chain,
        forceAtomic,
        calls: encodedCalls,
      });
      return typeof res === 'string' ? res : res.id;
    };

    let id: string;
    try {
      // 非强制原子：多数注入钱包可一次确认多笔
      id = await trySend(false);
      perf.mark('sendCalls:userConfirmed', { forceAtomic: false, id: id.slice(0, 18) });
    } catch (firstErr) {
      if (isUserRejected(firstErr)) throw firstErr;
      perf.mark('sendCalls:retryAtomic', {
        reason: errorMessage(firstErr).slice(0, 120),
      });
      // 再试原子批量
      id = await trySend(true);
      perf.mark('sendCalls:userConfirmed', { forceAtomic: true, id: id.slice(0, 18) });
    }

    perf.mark('waitForCallsStatus:begin');
    const status = await walletClient.waitForCallsStatus({
      id,
      timeout: 180_000,
    });
    perf.mark('waitForCallsStatus:done', { status: status.status });

    if (status.status !== 'success') {
      throw new Error(`批量交易未成功：${status.status}`);
    }

    const hashes = (status.receipts ?? [])
      .map((r) => r.transactionHash as Hex | undefined)
      .filter((h): h is Hash => typeof h === 'string' && h.startsWith('0x'));

    if (hashes.length === 0) {
      throw new Error('批量交易已提交但未返回交易哈希，请稍后在区块浏览器核对');
    }

    perf.done('ok-batch', { hashCount: hashes.length });
    return { hashes, primaryHash: hashes[hashes.length - 1] };
  } catch (err) {
    if (isUserRejected(err)) {
      perf.done('user-rejected');
      throw err;
    }
    if (!isBatchUnsupportedError(err)) {
      perf.done('FAIL-batch', { message: errorMessage(err).slice(0, 160) });
      throw err;
    }

    console.warn('[CCTP] 钱包不支持 EIP-5792 批量，回退为顺序签名', err);
    perf.mark('fallbackSequential');
    const hashes: Hash[] = [];
    for (let i = 0; i < calls.length; i++) {
      const call = calls[i];
      perf.mark(`writeContract[${i}]:requestWalletPopup`, {
        functionName: call.functionName,
      });
      hashes.push(await writeOne(walletClient, account, chain, call));
      perf.mark(`writeContract[${i}]:userConfirmed`, {
        hash: hashes[i].slice(0, 10),
      });
    }
    perf.done('ok-sequential', { hashCount: hashes.length });
    return { hashes, primaryHash: hashes[hashes.length - 1] };
  }
}
