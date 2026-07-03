import { network } from "hardhat";
import { encodeFunctionData } from "viem";

async function main() {
  const { viem } = await network.create();
  const [deployer] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  console.log("Deploying contracts with account:", deployer.account.address);

  async function waitForTx(hash: `0x${string}`) {
    await publicClient.waitForTransactionReceipt({ hash });
  }

  // ============ 1. Deploy SAPToken (Proxy) ============
  console.log("\n=== Deploying SAPToken ===");

  // Deploy implementation
  const sapTokenImpl = await viem.deployContract("SAPToken");
  console.log("SAPToken implementation:", sapTokenImpl.address);

  // Encode initialize call
  const sapTokenInitData = encodeFunctionData({
    abi: sapTokenImpl.abi,
    functionName: "initialize",
    args: ["SAP Token", "SAP", deployer.account.address],
  });

  // Deploy proxy
  const sapTokenProxy = await viem.deployContract("SAPTokenProxy", [
    sapTokenImpl.address,
    sapTokenInitData,
  ]);
  console.log("SAPToken proxy:", sapTokenProxy.address);

  // Get contract instance at proxy address
  const sapToken = await viem.getContractAt("SAPToken", sapTokenProxy.address);
  console.log("SAPToken initialized");

  // ============ 2. Deploy SAPSwapRouter (Proxy) ============
  console.log("\n=== Deploying SAPSwapRouter ===");
  const FEE_BPS = 100n; // 1% fee

  // Deploy implementation
  const swapRouterImpl = await viem.deployContract("SAPSwapRouter");
  console.log("SAPSwapRouter implementation:", swapRouterImpl.address);

  // Encode initialize call
  const swapRouterInitData = encodeFunctionData({
    abi: swapRouterImpl.abi,
    functionName: "initialize",
    args: [
      deployer.account.address,
      sapTokenProxy.address,
      deployer.account.address,
      FEE_BPS,
    ],
  });

  // Deploy proxy
  const swapRouterProxy = await viem.deployContract("SAPSwapRouterProxy", [
    swapRouterImpl.address,
    swapRouterInitData,
  ]);
  console.log("SAPSwapRouter proxy:", swapRouterProxy.address);

  // Get contract instance at proxy address
  const swapRouter = await viem.getContractAt("SAPSwapRouter", swapRouterProxy.address);
  console.log("SAPSwapRouter initialized");

  // ============ 3. Grant EXCHANGE_ROLE ============
  console.log("\n=== Granting EXCHANGE_ROLE ===");
  const EXCHANGE_ROLE = await sapToken.read.EXCHANGE_ROLE();
  console.log("EXCHANGE_ROLE:", EXCHANGE_ROLE);

  const grantTx = await deployer.writeContract({
    address: sapToken.address,
    abi: sapToken.abi,
    functionName: "grantRole",
    args: [EXCHANGE_ROLE, swapRouterProxy.address],
  });
  await waitForTx(grantTx);
  console.log("EXCHANGE_ROLE granted to SAPSwapRouter");

  // ============ 4. Summary ============
  console.log("\n=== Deployment Summary ===");
  console.log("Network: Arc Testnet (chainId: 5042002)");
  console.log("SAPToken Proxy:", sapTokenProxy.address);
  console.log("SAPToken Implementation:", sapTokenImpl.address);
  console.log("SAPSwapRouter Proxy:", swapRouterProxy.address);
  console.log("SAPSwapRouter Implementation:", swapRouterImpl.address);
  console.log("Fee Recipient:", deployer.account.address);
  console.log("Fee BPS:", FEE_BPS.toString());
  console.log("\nNext steps:");
  console.log("1. Add supported stablecoins: swapRouter.addStablecoin(tokenAddress, decimals, symbol, rateToSAP)");
  console.log("2. Update deployments/5042002.json with new addresses");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
