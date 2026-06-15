import { isPaymentChain } from '../config/paymentChains';

export type ChainMismatchInfo = {
  /** 钱包 connector 当前链 */
  connectorChainId: number;
  /** wagmi connection 记录的链 */
  connectionChainId: number;
};

/** 解析 wagmi ConnectorChainMismatchError 文案 */
export function parseChainMismatchMessage(message: string): ChainMismatchInfo | null {
  const currentMatch = message.match(/Current Chain ID:\s*(\d+)/i);
  const expectedMatch = message.match(/Expected Chain ID:\s*(\d+)/i);
  if (currentMatch && expectedMatch) {
    return {
      connectorChainId: Number(currentMatch[1]),
      connectionChainId: Number(expectedMatch[1]),
    };
  }

  const altMatch = message.match(
    /connector\s*\(id:\s*(\d+)\)[\s\S]*?connection(?:'s)?\s*chain\s*\(id:\s*(\d+)\)/i,
  );
  if (altMatch) {
    return {
      connectorChainId: Number(altMatch[1]),
      connectionChainId: Number(altMatch[2]),
    };
  }

  return null;
}

export function isChainMismatchError(message: string | undefined): boolean {
  if (!message) return false;
  return message.includes('does not match the connection') || parseChainMismatchMessage(message) != null;
}

/** 钱包当前链是否为应用支持的支付/可切换链 */
export function isRecoverableWalletChain(chainId: number): boolean {
  return isPaymentChain(chainId);
}
