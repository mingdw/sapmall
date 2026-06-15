import "dotenv/config";
import { network } from "hardhat";
import { WaitForTransactionReceiptTimeoutError } from "viem";
import type { Abi, Address } from "viem";

const GAS_HEADROOM_NUM = 3n;
const GAS_HEADROOM_DEN = 2n;

async function simulateAndEstimateGas(params: {
  publicClient: { simulateContract: any; estimateContractGas: any };
  account: { address: Address };
  address: Address;
  abi: Abi;
  functionName: string;
  args: readonly unknown[];
}): Promise<bigint> {
  const { publicClient, account, address, abi, functionName, args } = params;
  await publicClient.simulateContract({ account, address, abi, functionName, args });
  const est = await publicClient.estimateContractGas({ account, address, abi, functionName, args });
  const gas = (est * GAS_HEADROOM_NUM) / GAS_HEADROOM_DEN;
  return gas > 8_000_000n ? gas : 8_000_000n;
}

async function printTx(label: string, hash: `0x${string}`, publicClient: any) {
  const explorerBase = "https://sepolia.lineascan.build/tx/";
  try {
    await publicClient.waitForTransactionReceipt({ hash, timeout: 600000 });
  } catch (err) {
    if (err instanceof WaitForTransactionReceiptTimeoutError) {
      throw new Error(`Tx timeout, open ${explorerBase}${hash}`);
    }
    throw err;
  }
  console.log(`[${label}] ${explorerBase}${hash}`);
}

async function main() {
  const proxyAddress = process.env.PLATFORM_CONFIG_PROXY_ADDRESS as `0x${string}` | undefined;
  const routerAddress = process.env.PAYMENT_ROUTER_ADDRESS as `0x${string}` | undefined;
  const vaultAddress = process.env.SETTLEMENT_VAULT_ADDRESS as `0x${string}` | undefined;
  if (!proxyAddress || !routerAddress || !vaultAddress) throw new Error("Missing smoke env addresses");

  const hreNetwork = await network.connect("lineaSepolia");
  const { viem } = hreNetwork;
  const [admin] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();
  const config = await viem.getContractAt("PlatformConfig", proxyAddress);
  const router = await viem.getContractAt("PaymentRouter", routerAddress);
  const vault = await viem.getContractAt("SettlementVault", vaultAddress);

  const configAdminRole = await publicClient.readContract({ address: config.address, abi: config.abi, functionName: "CONFIG_ADMIN_ROLE" });
  const hasConfigAdmin = await publicClient.readContract({ address: config.address, abi: config.abi, functionName: "hasRole", args: [configAdminRole, admin.account.address] });
  if (!hasConfigAdmin) throw new Error("Admin missing CONFIG_ADMIN_ROLE");

  const suffix = Date.now().toString();
  const key = `smoke.platform.config.${suffix}`;
  const value = `v-${suffix}`;
  const exists = await publicClient.readContract({ address: config.address, abi: config.abi, functionName: "exists", args: [key] });
  if (exists) {
    const gas = await simulateAndEstimateGas({ publicClient, account: admin.account, address: config.address as Address, abi: config.abi as Abi, functionName: "updateConfig", args: [key, value, "string", "smoke update", 0] });
    const tx = await admin.writeContract({ address: config.address, abi: config.abi, functionName: "updateConfig", args: [key, value, "string", "smoke update", 0], gas });
    await printTx("updateConfig", tx, publicClient);
  } else {
    const args = [key, value, "string", "smoke create", 0] as const;
    const gas = await simulateAndEstimateGas({ publicClient, account: admin.account, address: config.address as Address, abi: config.abi as Abi, functionName: "createConfig", args });
    const tx = await admin.writeContract({ address: config.address, abi: config.abi, functionName: "createConfig", args, gas });
    await printTx("createConfig", tx, publicClient);
  }

  const token = await publicClient.readContract({ address: router.address, abi: router.abi, functionName: "paymentToken" });
  const chainId = await publicClient.readContract({ address: router.address, abi: router.abi, functionName: "expectedChainId" });
  const routerRole = await vault.read.ROUTER_ROLE();
  const hasRouterRole = await publicClient.readContract({ address: vault.address, abi: vault.abi, functionName: "hasRole", args: [routerRole, router.address] });
  console.log({ token, chainId: chainId.toString(), hasRouterRole });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
