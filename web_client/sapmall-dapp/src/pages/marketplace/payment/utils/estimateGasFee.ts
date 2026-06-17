import { ARC_TESTNET_CHAIN_ID } from '../../../../config/chains/arcTestnet';
import { LINEA_SEPOLIA_CHAIN_ID } from '../../../../config/chains/lineaSepolia';
import { BASE_SEPOLIA_CHAIN_ID } from '../../../../config/paymentChains';

/** 预估链上 Gas（USDC 计价展示用，后续可接钱包 estimateGas） */
export function estimateGasFeeUsdc(chainId?: number): number {
  if (chainId === ARC_TESTNET_CHAIN_ID) return 0.01;
  if (chainId === LINEA_SEPOLIA_CHAIN_ID) return 0.05;
  if (chainId === BASE_SEPOLIA_CHAIN_ID) return 0.04;
  return 0.05;
}

export function isArcTestnetChain(chainId?: number): boolean {
  return chainId === ARC_TESTNET_CHAIN_ID;
}
