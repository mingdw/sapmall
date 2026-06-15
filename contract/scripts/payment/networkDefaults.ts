export const CFG_PAYMENT_TOKEN_USDC = "payment.token.usdc";
export const CFG_PAYMENT_CHAIN_ID = "payment.chain.id";

export type PaymentNetworkPreset = {
  chainId: number;
  usdcAddress: `0x${string}`;
  explorerTxBase: string;
};

export const PAYMENT_NETWORK_PRESETS: Record<string, PaymentNetworkPreset> = {
  arcTestnet: {
    chainId: 5_042_002,
    usdcAddress: "0x3600000000000000000000000000000000000000",
    explorerTxBase: "https://testnet.arcscan.app/tx/",
  },
  lineaSepolia: {
    chainId: 59_141,
    usdcAddress: "0xFEce4462D57bD51A6A552365A011b95f0E16d9B7",
    explorerTxBase: "https://sepolia.lineascan.build/tx/",
  },
};

export function resolvePresetByChainId(chainId: number): PaymentNetworkPreset | undefined {
  return Object.values(PAYMENT_NETWORK_PRESETS).find((item) => item.chainId === chainId);
}
