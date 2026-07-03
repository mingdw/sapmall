import "dotenv/config";
import { network } from "hardhat";

import { deployPaymentV2 } from "./payment/deploy-upgrade-v2.js";

async function main() {
  const networkName = process.env.DEPLOY_NETWORK || "arcTestnet";
  const hreNetwork = await network.connect(networkName);
  const { viem } = hreNetwork;
  const [deployer] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  await deployPaymentV2({
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
