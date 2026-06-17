import {
  erc20Abi,
  type Address,
  type Hash,
  type PublicClient,
  type WalletClient,
  UserRejectedRequestError,
} from 'viem';
import { paymentRouterAbi } from '../../../../config/abis/paymentRouterAbi';
import type { PaymentIntentBundle } from '../../../../services/api/orderApi';

export type PayOrderErrorCode =
  | 'walletNotConnected'
  | 'invalidIntent'
  | 'tokenMismatch'
  | 'chainMismatch'
  | 'userRejected'
  | 'paymentFailed';

export class PayOrderError extends Error {
  readonly code: PayOrderErrorCode;
  /** 用户拒绝签名时所处的链上步骤 */
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
  const orderRefBytes = new TextEncoder().encode(bundle.orderCode);
  if (orderRefBytes.length === 0 || orderRefBytes.length > MAX_ORDER_REF_BYTES) {
    throw new PayOrderError('invalidIntent', 'orderRef 长度无效');
  }
  return amount;
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

/** approve（如需要）并调用 PaymentRouter.payOrder */
export async function executePayOrder(params: {
  walletClient: WalletClient;
  publicClient: PublicClient;
  bundle: PaymentIntentBundle;
  account: Address;
  onPhase?: (phase: 'approving' | 'paying') => void;
}): Promise<Hash> {
  const { walletClient, publicClient, bundle, account } = params;
  const amount = assertIntentBundle(bundle);

  const router = bundle.contractAddress as Address;
  const token = bundle.tokenAddress as Address;

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
        chain: walletClient.chain,
        address: token,
        abi: erc20Abi,
        functionName: 'approve',
        args: [router, amount],
      });
      await waitReceipt(publicClient, approveHash);
    }

    activeStage = 'pay';
    params.onPhase?.('paying');
    const payHash = await walletClient.writeContract({
      account,
      chain: walletClient.chain,
      address: router,
      abi: paymentRouterAbi,
      functionName: 'payOrder',
      args: [bundle.intentId, bundle.orderCode, token, amount],
    });
    await waitReceipt(publicClient, payHash);
    return payHash;
  } catch (err) {
    if (err instanceof PayOrderError) throw err;
    if (isUserRejectedWalletError(err)) {
      throw new PayOrderError('userRejected', undefined, activeStage);
    }
    throw new PayOrderError('paymentFailed', err instanceof Error ? err.message : undefined);
  }
}
