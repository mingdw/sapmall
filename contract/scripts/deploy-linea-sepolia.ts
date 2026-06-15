import "dotenv/config";
import { network } from "hardhat";

import { deployPaymentAndPlatformConfig } from "./payment/deployShared.js";

async function main() {
  const hreNetwork = await network.connect("lineaSepolia");
  const { viem } = hreNetwork;
  const [deployer] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  await deployPaymentAndPlatformConfig({
    networkName: hreNetwork.networkName,
    deployer,
    publicClient,
    viem,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
