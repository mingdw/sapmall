import "dotenv/config";
import { network } from "hardhat";

async function printTx(
  label: string,
  hash: `0x${string}`,
  publicClient: any,
) {
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  const tx = await publicClient.getTransaction({ hash });
  console.log(`[${label}] txHash=${hash}`);
  console.log(`[${label}] blockNumber=${receipt.blockNumber.toString()}`);
  console.log(`[${label}] from=${tx.from}`);
  console.log(`[${label}] to=${tx.to ?? "contract creation"}`);
  console.log(`[${label}] etherscan=https://sepolia.etherscan.io/tx/${hash}`);
}

async function main() {
  const proxyAddress = process.env.PLATFORM_CONFIG_PROXY_ADDRESS as `0x${string}` | undefined;
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  const pk = process.env.SEPOLIA_PRIVATE_KEY;
  if (!proxyAddress) {
    throw new Error("Missing env PLATFORM_CONFIG_PROXY_ADDRESS");
  }
  if (!rpcUrl) {
    throw new Error("Missing env SEPOLIA_RPC_URL");
  }
  if (!pk) {
    throw new Error("Missing env SEPOLIA_PRIVATE_KEY");
  }

  const hreNetwork = await network.connect("sepolia");
  const { viem } = hreNetwork;
  const [admin] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();
  const config = await viem.getContractAt("PlatformConfig", proxyAddress);

  console.log("Running Sepolia smoke test");
  console.log("RPC:", rpcUrl);
  console.log("PK prefix:", `${pk.slice(0, 8)}...`);
  console.log("Proxy:", proxyAddress);
  console.log("Admin:", admin.account.address);

  const suffix = Date.now().toString();
  const key = `smoke.platform.config.${suffix}`;
  const value = `v-${suffix}`;

  const exists = await publicClient.readContract({
    address: config.address,
    abi: config.abi,
    functionName: "exists",
    args: [key],
  });
  if (exists) {
    const updateTx = await admin.writeContract({
      address: config.address,
      abi: config.abi,
      functionName: "updateConfig",
      args: [key, value, "string", "smoke", "sepolia smoke update", 0],
    });
    await printTx("updateConfig", updateTx, publicClient);
  } else {
    const createTx = await admin.writeContract({
      address: config.address,
      abi: config.abi,
      functionName: "createConfig",
      args: [key, value, "string", "smoke", "sepolia smoke create", 0],
    });
    await printTx("createConfig", createTx, publicClient);
  }

  const numberKey = `smoke.platform.config.number.${suffix}`;
  const createNumberTx = await admin.writeContract({
    address: config.address,
    abi: config.abi,
    functionName: "createConfig",
    args: [numberKey, "1000", "number", "smoke", "sepolia smoke number", 0],
  });
  await printTx("createConfig(number)", createNumberTx, publicClient);

  const setUintTx = await admin.writeContract({
    address: config.address,
    abi: config.abi,
    functionName: "setConfigUintValue",
    args: [numberKey, 123456n],
  });
  await printTx("setConfigUintValue", setUintTx, publicClient);

  const item = await config.read.getConfig([key]);
  const numberValue = await config.read.getConfigUintValue([numberKey]);
  console.log(`[verify] key=${key}, value=${item.value}, exists=${item.exists}`);
  console.log(`[verify] numberKey=${numberKey}, uintValue=${numberValue.toString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
