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
  const cirbtcAddress = "0xf0C4a4CE82A5746AbAAd9425360Ab04fbBA432BF";

  const router = await viem.getContractAt("PaymentRouter", routerAddress);

  console.log("Adding cirBTC to token whitelist");
  console.log("  router:", routerAddress);
  console.log("  chainId:", chainId);
  console.log("  cirBTC:", cirbtcAddress);

  const isSupported = await router.read.isTokenSupported([BigInt(chainId), cirbtcAddress]);
  if (isSupported) {
    console.log("cirBTC already supported");
    return;
  }

  const tx = await admin.writeContract({
    address: routerAddress,
    abi: router.abi,
    functionName: "addToken",
    args: [BigInt(chainId), cirbtcAddress, 8, "cirBTC"],
  });

  await publicClient.waitForTransactionReceipt({ hash: tx });
  console.log("cirBTC added successfully");
  console.log("  tx:", tx);

  const config = await router.read.getTokenConfig([BigInt(chainId), cirbtcAddress]);
  console.log("  tokenConfig:", config);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
