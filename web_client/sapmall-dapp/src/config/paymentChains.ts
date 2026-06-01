import { ARC_TESTNET_CHAIN_ID } from './chains/arcTestnet';
import { LINEA_SEPOLIA_CHAIN_ID } from './chains/lineaSepolia';

/** 商城 USDC 支付可用链（须与 PlatformConfig / 后端 intent 一致） */
export const PAYMENT_CHAIN_IDS: readonly number[] = [
  LINEA_SEPOLIA_CHAIN_ID,
  ARC_TESTNET_CHAIN_ID,
];

export const DEFAULT_PAYMENT_CHAIN_ID = LINEA_SEPOLIA_CHAIN_ID;

export function isPaymentChain(chainId?: number): boolean {
  return chainId != null && (PAYMENT_CHAIN_IDS as readonly number[]).includes(chainId);
}

export function getPaymentChainLabel(chainId: number): string {
  if (chainId === LINEA_SEPOLIA_CHAIN_ID) return 'Linea Sepolia';
  if (chainId === ARC_TESTNET_CHAIN_ID) return 'Arc Testnet';
  return `Chain ${chainId}`;
}

export function getTxExplorerUrl(chainId: number, txHash: string): string | undefined {
  const hash = txHash.startsWith('0x') ? txHash : `0x${txHash}`;
  if (chainId === LINEA_SEPOLIA_CHAIN_ID) {
    return `https://sepolia.lineascan.build/tx/${hash}`;
  }
  if (chainId === ARC_TESTNET_CHAIN_ID) {
    return `https://testnet.arcscan.app/tx/${hash}`;
  }
  return undefined;
}
