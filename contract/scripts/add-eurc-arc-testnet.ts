import "dotenv/config";
import { network } from "hardhat";

async function main() {
  const routerAddress = process.env.PAYMENT_ROUTER_ADDRESS as `0x${string}`;
  if (!routerAddress) throw new Error("Missing PAYMENT_ROUTER_ADDRESS");

  const hreNetwork = await network.connect("arcTestnet");
  const { viem } = hreNetwork;
  const [admin] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  const chainId = await publicClient.getChainId();
  const eurcAddress = "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a";

  const router = await viem.getContractAt("PaymentRouter", routerAddress);

  console.log("Adding EURC to token whitelist");
  console.log("  router:", routerAddress);
  console.log("  chainId:", chainId);
  console.log("  EURC:", eurcAddress);

  const isSupported = await router.read.isTokenSupported([BigInt(chainId), eurcAddress]);
  if (isSupported) {
    console.log("EURC already supported");
    return;
  }

  const tx = await admin.writeContract({
    address: routerAddress,
    abi: router.abi,
    functionName: "addToken",
    args: [BigInt(chainId), eurcAddress, 6, "EURC"],
  });

  await publicClient.waitForTransactionReceipt({ hash: tx });
  console.log("EURC added successfully");
  console.log("  tx:", tx);

  const config = await router.read.getTokenConfig([BigInt(chainId), eurcAddress]);
  console.log("  tokenConfig:", config);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
