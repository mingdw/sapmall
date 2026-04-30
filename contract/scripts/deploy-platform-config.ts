import { network } from "hardhat";
import { encodeFunctionData } from "viem";

async function main() {
  const hreNetwork = await network.connect();
  const { viem } = hreNetwork;

  const [deployer] = await viem.getWalletClients();

  const admin = process.env.PLATFORM_CONFIG_ADMIN as `0x${string}` | undefined;
  if (!admin) {
    throw new Error("Missing env PLATFORM_CONFIG_ADMIN");
  }

  console.log("Deploying PlatformConfig with deployer:", deployer.account.address);
  console.log("PlatformConfig admin:", admin);

  // 1) 部署实现合约（UUPS implementation）
  const implementation = await viem.deployContract("PlatformConfig");
  console.log("PlatformConfig implementation:", implementation.address);

  // 2) 编码 initialize(admin)
  const initData = encodeFunctionData({
    abi: implementation.abi,
    functionName: "initialize",
    args: [admin],
  });

  // 3) 部署 ERC1967Proxy，并在构造参数中完成初始化调用
  const proxy = await viem.deployContract("PlatformConfigProxy", [
    implementation.address,
    initData,
  ]);

  console.log("PlatformConfig proxy:", proxy.address);
  console.log("");
  console.log("Use this address in backend config:");
  console.log("PLATFORM_CONFIG_CONTRACT_ADDRESS=", proxy.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
