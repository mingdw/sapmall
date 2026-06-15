import { ARC_TESTNET_CHAIN_ID } from './chains/arcTestnet';

/** 已部署 PaymentRouter 地址（与 contract/deployments/*.json 对齐） */
const PAYMENT_ROUTER_BY_CHAIN: Partial<Record<number, `0x${string}`>> = {
  [ARC_TESTNET_CHAIN_ID]: '0x57131c68477a51b9194bd6394e0ee79123742f69',
};

/** 解析 PaymentRouter 地址：env 优先，其次内置部署表 */
export function getPaymentRouterAddress(chainId: number): `0x${string}` | undefined {
  const fromEnv = process.env.REACT_APP_PAYMENT_ROUTER_ADDRESS?.trim();
  if (fromEnv?.startsWith('0x')) {
    return fromEnv as `0x${string}`;
  }
  return PAYMENT_ROUTER_BY_CHAIN[chainId];
}
