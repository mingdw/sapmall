import "dotenv/config";
import { network } from "hardhat";
import { WaitForTransactionReceiptTimeoutError } from "viem";
import type { Abi, Address } from "viem";

const GAS_HEADROOM_NUM = 3n;
const GAS_HEADROOM_DEN = 2n;
/** 冒烟用固定配置 key，重复执行走 updateConfig */
const SMOKE_CONFIG_KEY = "smoke.platform.config.verify";

function jsonLine(obj: unknown): string {
  return JSON.stringify(obj, (_k, v) => (typeof v === "bigint" ? v.toString() : v), 2);
}

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
  const explorerBase = "https://testnet.arcscan.app/tx/";
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

async function writeOrUpdateConfig(params: {
  config: { address: Address; abi: Abi };
  admin: { account: { address: Address }; writeContract: (...args: any[]) => Promise<`0x${string}`> };
  publicClient: { readContract: any; simulateContract: any; estimateContractGas: any };
  key: string;
  value: string;
  description: string;
}) {
  const { config, admin, publicClient, key, value, description } = params;
  const exists = await publicClient.readContract({
    address: config.address,
    abi: config.abi,
    functionName: "exists",
    args: [key],
  });
  const fn = exists ? "updateConfig" : "createConfig";
  const args = [key, value, "string", description, 0] as const;
  const gas = await simulateAndEstimateGas({
    publicClient,
    account: admin.account,
    address: config.address,
    abi: config.abi,
    functionName: fn,
    args,
  });
  const tx = await admin.writeContract({
    address: config.address,
    abi: config.abi,
    functionName: fn,
    args,
    gas,
  });
  await printTx(fn, tx, publicClient);
}

async function printAllPlatformConfigs(config: { read: { totalConfigs: () => Promise<bigint>; getAllKeys: () => Promise<readonly string[]>; listConfigs: (args: readonly [bigint, bigint]) => Promise<readonly [readonly { key: string; value: string; valueType: string; description: string; status: number; updatedAt: bigint; updatedBy: string }[], bigint]>; getConfig: (args: readonly [string]) => Promise<{ key: string; value: string }> } }) {  const total = await config.read.totalConfigs();
  console.log("\n========== PlatformConfig：全部 key 与 value ==========");
  console.log("totalConfigs:", total.toString());

  if (total === 0n) {
    console.log("（合约中无任何配置项）");
    console.log("======================================================\n");
    return;
  }

  const allKeys = await config.read.getAllKeys();
  const [items, totalListed] = await config.read.listConfigs([0n, total]);

  if (BigInt(allKeys.length) !== total || totalListed !== total) {
    console.warn(
      "[warn] getAllKeys / listConfigs 与 totalConfigs 数量不一致:",
      `keys=${allKeys.length} items=${items.length} totalListed=${totalListed} total=${total}`,
    );
  }

  console.log("getAllKeys:", allKeys.join(", "));
  console.log("--- 全部配置（key => value）---");
  for (let i = 0; i < items.length; i++) {
    const row = items[i];
    const fromGet = await config.read.getConfig([row.key]);
    const mismatch = fromGet.value !== row.value;
    console.log(`[${i}] ${row.key} => ${row.value}${mismatch ? "  ⚠ listConfigs 与 getConfig 不一致" : ""}`);
  }
  console.log("--- listConfigs 原始结构 ---");
  console.log(jsonLine(items));
  console.log("======================================================\n");
}

async function main() {
  const proxyAddress = process.env.PLATFORM_CONFIG_PROXY_ADDRESS as `0x${string}` | undefined;
  const routerAddress = process.env.PAYMENT_ROUTER_ADDRESS as `0x${string}` | undefined;
  const vaultAddress = process.env.SETTLEMENT_VAULT_ADDRESS as `0x${string}` | undefined;
  if (!proxyAddress || !routerAddress || !vaultAddress) throw new Error("Missing smoke env addresses");

  const hreNetwork = await network.connect("arcTestnet");
  const { viem } = hreNetwork;
  const [admin] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();
  const config = await viem.getContractAt("PlatformConfig", proxyAddress);
  const router = await viem.getContractAt("PaymentRouter", routerAddress);
  const vault = await viem.getContractAt("SettlementVault", vaultAddress);

  const configAdminRole = await publicClient.readContract({ address: config.address, abi: config.abi, functionName: "CONFIG_ADMIN_ROLE" });
  const hasConfigAdmin = await publicClient.readContract({ address: config.address, abi: config.abi, functionName: "hasRole", args: [configAdminRole, admin.account.address] });
  if (!hasConfigAdmin) throw new Error("Admin missing CONFIG_ADMIN_ROLE");

  // 用例：写入固定 key，校验读回，并拉取合约内全部 key 与 value
  const smokeValue = `arc-smoke-${Date.now()}`;
  console.log(`\n[case] PlatformConfig 写入 key="${SMOKE_CONFIG_KEY}" value="${smokeValue}"`);
  await writeOrUpdateConfig({
    config: { address: config.address as Address, abi: config.abi as Abi },
    admin,
    publicClient,
    key: SMOKE_CONFIG_KEY,
    value: smokeValue,
    description: "arc testnet smoke verify",
  });

  const written = await config.read.getConfig([SMOKE_CONFIG_KEY]);
  if (written.value !== smokeValue) {
    throw new Error(`写入后读回不一致: expected=${smokeValue} actual=${written.value}`);
  }
  console.log(`[case] getConfig 校验通过: ${SMOKE_CONFIG_KEY} => ${written.value}`);

  await printAllPlatformConfigs(config);

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
