import {
  erc20Abi,
  BaseError,
  ContractFunctionRevertedError,
  type Address,
  type Hash,
  type PublicClient,
  type WalletClient,
  UserRejectedRequestError,
} from 'viem';
import { paymentRouterAbi } from '../../../../config/abis/paymentRouterAbi';
import { config } from '../../../../config/wagmi';
import { getPaymentRouterAddress } from '../../../../config/paymentContracts';
import type { PaymentIntentBundle } from '../../../../services/api/orderApi';
import { getPaymentGasLimits } from './estimateGasFee';

export type PayOrderErrorCode =
  | 'walletNotConnected'
  | 'invalidIntent'
  | 'tokenMismatch'
  | 'chainMismatch'
  | 'userRejected'
  | 'paymentFailed';

export class PayOrderError extends Error {
  readonly code: PayOrderErrorCode;
  readonly stage?: 'approve' | 'pay';

  constructor(code: PayOrderErrorCode, message?: string, stage?: 'approve' | 'pay') {
    super(message ?? code);
    this.code = code;
    this.stage = stage;
  }
}

const MAX_ORDER_REF_BYTES = 64;

function assertIntentBundle(bundle: PaymentIntentBundle) {
  if (!bundle.contractAddress?.startsWith('0x') || !bundle.tokenAddress?.startsWith('0x')) {
    throw new PayOrderError('invalidIntent', '缺少合约或代币地址');
  }
  const amount = BigInt(bundle.amount);
  if (amount <= 0n) {
    throw new PayOrderError('invalidIntent', '支付金额无效');
  }
  if (!bundle.intentId?.trim()) {
    throw new PayOrderError('invalidIntent', '缺少 intentId');
  }
  if (!bundle.sellerAddress?.startsWith('0x')) {
    throw new PayOrderError('invalidIntent', '缺少卖家收款地址');
  }
  const orderRefBytes = new TextEncoder().encode(bundle.orderCode);
  if (orderRefBytes.length === 0 || orderRefBytes.length > MAX_ORDER_REF_BYTES) {
    throw new PayOrderError('invalidIntent', 'orderRef 长度无效');
  }
  return amount;
}

function resolvePaymentChain(chainId: number) {
  return config.chains.find((c) => c.id === chainId);
}

function resolveCanonicalRouter(bundle: PaymentIntentBundle): Address {
  const fromBundle = bundle.contractAddress as Address;
  const canonical = getPaymentRouterAddress(bundle.chainId);
  if (!canonical) return fromBundle;
  if (fromBundle.toLowerCase() !== canonical.toLowerCase()) {
    // 库内可能是旧 Router；链上授权须指向当前部署地址
    return canonical;
  }
  return fromBundle;
}

async function waitReceipt(publicClient: PublicClient, hash: Hash) {
  const receipt = await publicClient.waitForTransactionReceipt({ hash, timeout: 120_000 });
  if (receipt.status === 'reverted') {
    throw new PayOrderError('paymentFailed', '链上交易 revert');
  }
}

function isUserRejectedWalletError(err: unknown): boolean {
  if (err instanceof UserRejectedRequestError) return true;
  if (!(err instanceof Error)) return false;
  if (err.name === 'UserRejectedRequestError') return true;
  const msg = err.message.toLowerCase();
  if (
    msg.includes('user rejected') ||
    msg.includes('user denied') ||
    msg.includes('rejected the request') ||
    msg.includes('request rejected') ||
    msg.includes('action_rejected')
  ) {
    return true;
  }
  const cause = (err as Error & { cause?: unknown }).cause;
  return cause != null && isUserRejectedWalletError(cause);
}

function extractContractErrorMessage(err: unknown): string | undefined {
  if (err instanceof BaseError) {
    const reverted = err.walk((e) => e instanceof ContractFunctionRevertedError);
    if (reverted instanceof ContractFunctionRevertedError) {
      return reverted.reason ?? reverted.data?.errorName ?? reverted.shortMessage;
    }
    return err.shortMessage;
  }
  return err instanceof Error ? err.message : undefined;
}

/** approve（如需要）并调用 PaymentRouter.payOrder */
export async function executePayOrder(params: {
  walletClient: WalletClient;
  publicClient: PublicClient;
  bundle: PaymentIntentBundle;
  account: Address;
  onPhase?: (phase: 'approving' | 'paying') => void;
  /** payOrder 交易已提交（拿到 hash）时回调，便于前端上报 confirming 并轮询 /status */
  onPaySubmitted?: (hash: Hash) => void | Promise<void>;
}): Promise<Hash> {
  const { walletClient, publicClient, bundle, account } = params;
  const amount = assertIntentBundle(bundle);

  const paymentChain = resolvePaymentChain(bundle.chainId);
  if (!paymentChain) {
    throw new PayOrderError('chainMismatch', '支付链未在钱包配置中启用');
  }

  const router = resolveCanonicalRouter(bundle);
  const token = bundle.tokenAddress as Address;
  const gasLimits = getPaymentGasLimits(bundle.chainId);

  const allowance = await publicClient.readContract({
    address: token,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [account, router],
  });

  let activeStage: 'approve' | 'pay' = allowance < amount ? 'approve' : 'pay';
  try {
    if (allowance < amount) {
      activeStage = 'approve';
      params.onPhase?.('approving');

      const approveHash = await walletClient.writeContract({
        account,
        chain: paymentChain,
        address: token,
        abi: erc20Abi,
        functionName: 'approve',
        args: [router, amount],
        gas: BigInt(gasLimits.approve),
      });
      await waitReceipt(publicClient, approveHash);
    }

    activeStage = 'pay';
    params.onPhase?.('paying');

    let tokenSupported = false;
    try {
      tokenSupported = await publicClient.readContract({
        address: router,
        abi: paymentRouterAbi,
        functionName: 'isTokenSupported',
        args: [BigInt(bundle.chainId), token],
      });
    } catch {
      throw new PayOrderError(
        'paymentFailed',
        'isTokenSupported reverted: PaymentRouter 地址无效或版本过旧',
      );
    }
    if (!tokenSupported) {
      throw new PayOrderError('paymentFailed', 'TokenNotSupported');
    }

    const tokenBalance = await publicClient.readContract({
      address: token,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [account],
    });
    if (tokenBalance < amount) {
      throw new PayOrderError('paymentFailed', 'ERC20: transfer amount exceeds balance');
    }

    const intentPaid = await publicClient.readContract({
      address: router,
      abi: paymentRouterAbi,
      functionName: 'isIntentPaid',
      args: [bundle.intentId],
    });
    if (intentPaid) {
      throw new PayOrderError('paymentFailed', 'IntentAlreadyPaid');
    }

    const allowanceBeforePay = await publicClient.readContract({
      address: token,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [account, router],
    });
    if (allowanceBeforePay < amount) {
      throw new PayOrderError(
        'paymentFailed',
        '代币授权额度不足，请重新点击继续支付并完成授权',
      );
    }

    // 固定 gas limit + 钱包弹窗确认；不做 estimateContractGas 链上模拟
    const payHash = await walletClient.writeContract({
      account,
      chain: paymentChain,
      address: router,
      abi: paymentRouterAbi,
      functionName: 'payOrder',
      args: [bundle.intentId, bundle.orderCode, bundle.sellerAddress as Address, token, amount],
      gas: BigInt(gasLimits.payOrder),
    });
    await params.onPaySubmitted?.(payHash);
    await waitReceipt(publicClient, payHash);
    return payHash;
  } catch (err) {
    if (err instanceof PayOrderError) throw err;
    if (isUserRejectedWalletError(err)) {
      throw new PayOrderError('userRejected', undefined, activeStage);
    }
    throw new PayOrderError(
      'paymentFailed',
      extractContractErrorMessage(err) ?? 'paymentFailed',
      activeStage,
    );
  }
}
