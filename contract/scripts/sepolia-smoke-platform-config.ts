import "dotenv/config";
import { network } from "hardhat";
import { WaitForTransactionReceiptTimeoutError } from "viem";
import type { Abi, Address } from "viem";

/** Linea 等链上 eth_estimateGas 偶发偏紧，给写操作留余量 */
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
  console.log(`[smoke] eth_call simulateContract → ${functionName} …`);
  await publicClient.simulateContract({
    account,
    address,
    abi,
    functionName,
    args,
  });
  console.log(`[smoke] eth_estimateGas → ${functionName} …`);
  const est = await publicClient.estimateContractGas({
    account,
    address,
    abi,
    functionName,
    args,
  });
  const withHeadroom = (est * GAS_HEADROOM_NUM) / GAS_HEADROOM_DEN;
  const gas = withHeadroom > 8_000_000n ? withHeadroom : 8_000_000n;
  console.log(`[smoke] gas est=${est.toString()} use=${gas.toString()}`);
  return gas;
}

async function printTx(
  label: string,
  hash: `0x${string}`,
  publicClient: any,
) {
  const id = await publicClient.getChainId();
  const explorerBase =
    id === 59_141n
      ? "https://sepolia.lineascan.build/tx/"
      : id === 11_155_111n
        ? "https://sepolia.etherscan.io/tx/"
        : "https://explorer/tx/";
  const receiptTimeoutMs = Number.parseInt(
    process.env.SMOKE_TX_RECEIPT_TIMEOUT_MS ?? "600000",
    10,
  );

  console.log(`[${label}] submitted txHash=${hash}`);
  console.log(`[${label}] explorer (pending) ${explorerBase}${hash}`);
  console.log(`[${label}] waiting for receipt (timeout ${receiptTimeoutMs / 1000}s) …`);
  let receipt;
  try {
    receipt = await publicClient.waitForTransactionReceipt({
      hash,
      timeout: receiptTimeoutMs,
    });
  } catch (err) {
    if (err instanceof WaitForTransactionReceiptTimeoutError) {
      const url = `${explorerBase}${hash}`;
      throw new Error(
        [
          `等待链上回执超时（${receiptTimeoutMs / 1000}s），交易可能仍在 mempool 或 RPC 较慢。`,
          `请在浏览器打开: ${url}`,
          `自查: ① 钱包 Linea Sepolia ETH 是否够付 gas；② 是否长期 Pending（可提高 maxFee 后加速/重发）；③ 换稳定 RPC。`,
          `可通过环境变量 SMOKE_TX_RECEIPT_TIMEOUT_MS 加大等待毫秒数（默认 600000）。`,
        ].join("\n"),
      );
    }
    throw err;
  }
  const tx = await publicClient.getTransaction({ hash });
  console.log(`[${label}] txHash=${hash}`);
  console.log(`[${label}] blockNumber=${receipt.blockNumber.toString()}`);
  console.log(`[${label}] from=${tx.from}`);
  console.log(`[${label}] to=${tx.to ?? "contract creation"}`);
  console.log(`[${label}] explorer=${explorerBase}${hash}`);
}

async function main() {
  const proxyAddress = process.env.PLATFORM_CONFIG_PROXY_ADDRESS as `0x${string}` | undefined;
  if (!proxyAddress) {
    throw new Error("Missing env PLATFORM_CONFIG_PROXY_ADDRESS");
  }

  const hreNetwork = await network.connect();
  const { viem } = hreNetwork;
  const [admin] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();
  const config = await viem.getContractAt("PlatformConfig", proxyAddress);

  const chainId = await publicClient.getChainId();
  console.log("Running PlatformConfig smoke test");
  console.log("chainId:", chainId.toString());
  console.log("Proxy:", proxyAddress);
  console.log("Admin:", admin.account.address);

  const configAdminRole = await publicClient.readContract({
    address: config.address,
    abi: config.abi,
    functionName: "CONFIG_ADMIN_ROLE",
  });
  const [hasConfigAdmin, isPaused, total] = await Promise.all([
    publicClient.readContract({
      address: config.address,
      abi: config.abi,
      functionName: "hasRole",
      args: [configAdminRole, admin.account.address],
    }),
    publicClient.readContract({
      address: config.address,
      abi: config.abi,
      functionName: "paused",
    }),
    publicClient.readContract({
      address: config.address,
      abi: config.abi,
      functionName: "totalConfigs",
    }),
  ]);
  console.log("hasRole(CONFIG_ADMIN_ROLE, admin):", hasConfigAdmin);
  console.log("paused:", isPaused);
  console.log("totalConfigs (expect >=5 after init):", total.toString());
  if (!hasConfigAdmin) {
    throw new Error(
      "当前钱包无 CONFIG_ADMIN_ROLE：请把 LINEA_SEPOLIA_PRIVATE_KEY / SEPOLIA_PRIVATE_KEY 设为与部署时 PLATFORM_CONFIG_ADMIN 同一地址的私钥，或给该钱包 grant CONFIG_ADMIN_ROLE",
    );
  }
  if (isPaused) {
    throw new Error("合约处于 pause 状态，createConfig 会触发 whenNotPaused 失败，请先 unpause");
  }

  const suffix = Date.now().toString();
  const key = `smoke.platform.config.${suffix}`;
  const value = `v-${suffix}`;

  console.log("[smoke] read exists …");
  const exists = await publicClient.readContract({
    address: config.address,
    abi: config.abi,
    functionName: "exists",
    args: [key],
  });
  console.log("[smoke] exists:", exists);
  if (exists) {
    const gas = await simulateAndEstimateGas({
      publicClient,
      account: admin.account,
      address: config.address as Address,
      abi: config.abi as Abi,
      functionName: "updateConfig",
      args: [key, value, "string", "smoke update", 0],
    });
    console.log("[smoke] send updateConfig tx …");
    const updateTx = await admin.writeContract({
      address: config.address,
      abi: config.abi,
      functionName: "updateConfig",
      args: [key, value, "string", "smoke update", 0],
      gas,
    });
    await printTx("updateConfig", updateTx, publicClient);
  } else {
    const createArgs = [key, value, "string", "smoke create", 0] as const;
    const gas = await simulateAndEstimateGas({
      publicClient,
      account: admin.account,
      address: config.address as Address,
      abi: config.abi as Abi,
      functionName: "createConfig",
      args: createArgs,
    });
    console.log("[smoke] send createConfig tx …");
    const createTx = await admin.writeContract({
      address: config.address,
      abi: config.abi,
      functionName: "createConfig",
      args: createArgs,
      gas,
    });
    await printTx("createConfig", createTx, publicClient);
  }

  const numberKey = `smoke.platform.config.number.${suffix}`;
  const numberCreateArgs = [numberKey, "1000", "number", "smoke number", 0] as const;
  console.log("[smoke] second createConfig (number) …");
  const gasNumberCreate = await simulateAndEstimateGas({
    publicClient,
    account: admin.account,
    address: config.address as Address,
    abi: config.abi as Abi,
    functionName: "createConfig",
    args: numberCreateArgs,
  });
  console.log("[smoke] send createConfig(number) tx …");
  const createNumberTx = await admin.writeContract({
    address: config.address,
    abi: config.abi,
    functionName: "createConfig",
    args: numberCreateArgs,
    gas: gasNumberCreate,
  });
  await printTx("createConfig(number)", createNumberTx, publicClient);

  console.log("[smoke] setConfigUintValue …");
  const gasSetUint = await simulateAndEstimateGas({
    publicClient,
    account: admin.account,
    address: config.address as Address,
    abi: config.abi as Abi,
    functionName: "setConfigUintValue",
    args: [numberKey, 123456n],
  });
  console.log("[smoke] send setConfigUintValue tx …");
  const setUintTx = await admin.writeContract({
    address: config.address,
    abi: config.abi,
    functionName: "setConfigUintValue",
    args: [numberKey, 123456n],
    gas: gasSetUint,
  });
  await printTx("setConfigUintValue", setUintTx, publicClient);

  const item = await config.read.getConfig([key]);
  const numberValue = await config.read.getConfigUintValue([numberKey]);
  console.log(`[verify] key=${key}, value=${item.value}`);
  console.log(`[verify] numberKey=${numberKey}, uintValue=${numberValue.toString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
