import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // 部署参数
  const SAP_TOKEN_ADDRESS = process.env.SAP_TOKEN_ADDRESS || "";
  const FEE_RECIPIENT = process.env.FEE_RECIPIENT || deployer.address;
  const FEE_BPS = 100; // 1%手续费

  if (!SAP_TOKEN_ADDRESS) {
    console.error("Please set SAP_TOKEN_ADDRESS environment variable");
    process.exit(1);
  }

  // 部署SAPSwapRouter
  console.log("Deploying SAPSwapRouter...");
  const SAPSwapRouter = await ethers.getContractFactory("SAPSwapRouter");
  const swapRouter = await SAPSwapRouter.deploy();
  await swapRouter.waitForDeployment();

  const swapRouterAddress = await swapRouter.getAddress();
  console.log("SAPSwapRouter deployed to:", swapRouterAddress);

  // 初始化
  console.log("Initializing SAPSwapRouter...");
  await swapRouter.initialize(
    deployer.address,
    SAP_TOKEN_ADDRESS,
    FEE_RECIPIENT,
    FEE_BPS
  );

  // 授权EXCHANGE_ROLE
  console.log("Granting EXCHANGE_ROLE to SAPSwapRouter...");
  const sapToken = await ethers.getContractAt("SAPToken", SAP_TOKEN_ADDRESS);
  const EXCHANGE_ROLE = ethers.keccak256(ethers.toUtf8Bytes("EXCHANGE_ROLE"));
  await sapToken.grantRole(EXCHANGE_ROLE, swapRouterAddress);

  console.log("Deployment completed!");
  console.log("SAPSwapRouter:", swapRouterAddress);
  console.log("SAP Token:", SAP_TOKEN_ADDRESS);
  console.log("Fee Recipient:", FEE_RECIPIENT);
  console.log("Fee BPS:", FEE_BPS);

  // 添加支持的稳定币（需要手动执行）
  console.log("\nNext steps:");
  console.log("1. Add supported stablecoins using addStablecoin()");
  console.log("2. Set up frontend integration");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
