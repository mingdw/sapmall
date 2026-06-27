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
  const usycAddress = "0xe9185F0c5F296Ed1797AaE4238D26CCaBEadb86C";

  const router = await viem.getContractAt("PaymentRouter", routerAddress);

  console.log("Adding USYC to token whitelist");
  console.log("  router:", routerAddress);
  console.log("  chainId:", chainId);
  console.log("  USYC:", usycAddress);

  const isSupported = await router.read.isTokenSupported([BigInt(chainId), usycAddress]);
  if (isSupported) {
    console.log("USYC already supported");
    return;
  }

  const tx = await admin.writeContract({
    address: routerAddress,
    abi: router.abi,
    functionName: "addToken",
    args: [BigInt(chainId), usycAddress, 6, "USYC"],
  });

  await publicClient.waitForTransactionReceipt({ hash: tx });
  console.log("USYC added successfully");
  console.log("  tx:", tx);

  const config = await router.read.getTokenConfig([BigInt(chainId), usycAddress]);
  console.log("  tokenConfig:", config);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
