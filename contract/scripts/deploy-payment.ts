import "dotenv/config";
import { network } from "hardhat";
import { encodeFunctionData } from "viem";

/**
 * 部署 SettlementVault（不可升级）+ PaymentRouter（UUPS 代理）。
 *
 * 前置条件（需先在 PlatformConfig 手工/管理端配置，本脚本不会写入 Config）：
 *   - payment.token.usdc  (valueType=address)
 *   - payment.chain.id    (valueType=number)
 *
 * 环境变量：
 *   PAYMENT_ADMIN                    — Router/Vault DEFAULT_ADMIN（请使用新的安全 EOA，勿提交私钥）
 *   PLATFORM_CONFIG_PROXY_ADDRESS    — 已部署 PlatformConfig 代理地址
 *   LINEA_SEPOLIA_PRIVATE_KEY / ARC_TESTNET_PRIVATE_KEY — 对应网络部署账号
 */
async function main() {
  const hreNetwork = await network.connect();
  const { viem } = hreNetwork;

  const [deployer] = await viem.getWalletClients();
  const chainId = await viem.getPublicClient().getChainId();

  const admin = process.env.PAYMENT_ADMIN as `0x${string}` | undefined;
  const platformConfigProxy = process.env.PLATFORM_CONFIG_PROXY_ADDRESS as `0x${string}` | undefined;

  if (!admin) {
    throw new Error("Missing env PAYMENT_ADMIN (use a dedicated secure EOA, not committed to git)");
  }
  if (!platformConfigProxy) {
    throw new Error("Missing env PLATFORM_CONFIG_PROXY_ADDRESS");
  }

  console.log("Deploying payment stack");
  console.log("  network chainId:", chainId);
  console.log("  deployer:", deployer.account.address);
  console.log("  PAYMENT_ADMIN:", admin);
  console.log("  PlatformConfig proxy:", platformConfigProxy);

  const config = await viem.getContractAt("PlatformConfig", platformConfigProxy);
  const usdcItem = await config.read.getConfig(["payment.token.usdc"]);
  const chainItem = await config.read.getConfig(["payment.chain.id"]);
  console.log("  preflight payment.token.usdc:", usdcItem.value, "status=", usdcItem.status);
  console.log("  preflight payment.chain.id:", chainItem.value, "status=", chainItem.status);

  const vault = await viem.deployContract("SettlementVault", [admin]);
  console.log("SettlementVault:", vault.address);

  const routerImpl = await viem.deployContract("PaymentRouter");
  console.log("PaymentRouter implementation:", routerImpl.address);

  const initData = encodeFunctionData({
    abi: routerImpl.abi,
    functionName: "initialize",
    args: [admin, platformConfigProxy, vault.address],
  });

  const routerProxy = await viem.deployContract("PaymentRouterProxy", [routerImpl.address, initData]);
  console.log("PaymentRouter proxy:", routerProxy.address);

  const routerRole = await vault.read.ROUTER_ROLE();
  const grantTx = await deployer.writeContract({
    address: vault.address,
    abi: vault.abi,
    functionName: "grantRole",
    args: [routerRole, routerProxy.address],
  });
  await viem.getPublicClient().waitForTransactionReceipt({ hash: grantTx });
  console.log("Granted ROUTER_ROLE on SettlementVault to PaymentRouter proxy");

  console.log("");
  console.log("--- Record for backend / Phase 2 ---");
  console.log(JSON.stringify({
    chainId,
    platformConfig: platformConfigProxy,
    settlementVault: vault.address,
    paymentRouter: routerProxy.address,
    paymentRouterImplementation: routerImpl.address,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
