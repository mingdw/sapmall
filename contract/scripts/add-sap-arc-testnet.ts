import "dotenv/config";
import { network } from "hardhat";

/**
 * 将 SAP 加入 Arc Testnet PaymentRouter 支付白名单。
 * 依赖 .env：PAYMENT_ROUTER_ADDRESS、SAP_TOKEN_ADDRESS、CONTRACT_PRIVATE_KEY（须为 PAYMENT_ADMIN）
 */
async function main() {
  const routerAddress = process.env.PAYMENT_ROUTER_ADDRESS as `0x${string}`;
  const sapAddress = process.env.SAP_TOKEN_ADDRESS as `0x${string}`;
  if (!routerAddress) throw new Error("Missing PAYMENT_ROUTER_ADDRESS");
  if (!sapAddress) throw new Error("Missing SAP_TOKEN_ADDRESS");

  const hreNetwork = await network.connect("arcTestnet");
  const { viem } = hreNetwork;
  const [admin] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  const chainId = await publicClient.getChainId();
  const router = await viem.getContractAt("PaymentRouter", routerAddress);

  console.log("Adding SAP to PaymentRouter token whitelist");
  console.log("  router:", routerAddress);
  console.log("  chainId:", chainId);
  console.log("  SAP:", sapAddress);
  console.log("  admin:", admin.account.address);

  const isSupported = await router.read.isTokenSupported([BigInt(chainId), sapAddress]);
  if (isSupported) {
    console.log("SAP already supported on PaymentRouter");
    const config = await router.read.getTokenConfig([BigInt(chainId), sapAddress]);
    console.log("  tokenConfig:", config);
    return;
  }

  const tx = await admin.writeContract({
    address: routerAddress,
    abi: router.abi,
    functionName: "addToken",
    args: [BigInt(chainId), sapAddress, 18, "SAP"],
  });

  await publicClient.waitForTransactionReceipt({ hash: tx });
  console.log("SAP added successfully");
  console.log("  tx:", tx);

  const config = await router.read.getTokenConfig([BigInt(chainId), sapAddress]);
  console.log("  tokenConfig:", config);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
