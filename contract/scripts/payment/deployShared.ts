import "dotenv/config";
import { encodeFunctionData } from "viem";

import { resolvePresetByChainId } from "./networkDefaults.js";
import { saveDeployment, type DeploymentRecord } from "./saveDeployment.js";

type DeployContext = {
  networkName: string;
  deployer: {
    account: {
      address: `0x${string}`;
    };
    writeContract(params: {
      address: `0x${string}`;
      abi: readonly unknown[];
      functionName: string;
      args: readonly unknown[];
    }): Promise<`0x${string}`>;
  };
  publicClient: {
    getChainId(): Promise<number>;
    readContract(params: {
      address: `0x${string}`;
      abi: readonly unknown[];
      functionName: string;
      args?: readonly unknown[];
    }): Promise<unknown>;
    waitForTransactionReceipt(params: { hash: `0x${string}` }): Promise<unknown>;
  };
  viem: {
    deployContract(name: string, args?: readonly unknown[]): Promise<{ address: `0x${string}`; abi: readonly unknown[] }>;
  };
};

export async function deployPaymentAndPlatformConfig(ctx: DeployContext) {
  const chainId = await ctx.publicClient.getChainId();
  const preset = resolvePresetByChainId(chainId);
  if (!preset) {
    throw new Error(`No preset for chainId=${chainId}. Add it to scripts/payment/networkDefaults.ts`);
  }

  const deployerAddress = ctx.deployer.account.address;
  const admin = (process.env.PAYMENT_ADMIN as `0x${string}` | undefined) ?? deployerAddress;
  const platformConfigAdmin = (process.env.PLATFORM_CONFIG_ADMIN as `0x${string}` | undefined) ?? admin;
  const paymentToken = (process.env.PAYMENT_USDC_ADDRESS as `0x${string}` | undefined) ?? preset.usdcAddress;

  console.log("Deploying payment + PlatformConfig stack");
  console.log("  network:", ctx.networkName);
  console.log("  chainId:", chainId);
  console.log("  deployer:", deployerAddress);
  console.log("  PAYMENT_ADMIN:", admin);
  console.log("  PLATFORM_CONFIG_ADMIN:", platformConfigAdmin);
  console.log("  paymentToken:", paymentToken);
  console.log("  explorer:", preset.explorerTxBase);

  const vault = await ctx.viem.deployContract("SettlementVault", [admin]);
  console.log("SettlementVault:", vault.address);

  const routerImpl = await ctx.viem.deployContract("PaymentRouter");
  console.log("PaymentRouter implementation:", routerImpl.address);

  const initRouterData = encodeFunctionData({
    abi: routerImpl.abi,
    functionName: "initialize",
    args: [admin, vault.address],
  });

  const routerProxy = await ctx.viem.deployContract("PaymentRouterProxy", [routerImpl.address, initRouterData]);
  console.log("PaymentRouter proxy:", routerProxy.address);

  const addTokenTx = await ctx.deployer.writeContract({
    address: routerProxy.address,
    abi: routerImpl.abi,
    functionName: "addToken",
    args: [BigInt(chainId), paymentToken, 6, "USDC"],
  });
  await ctx.publicClient.waitForTransactionReceipt({ hash: addTokenTx });
  console.log("Added USDC to token whitelist");

  const platformImpl = await ctx.viem.deployContract("PlatformConfig");
  console.log("PlatformConfig implementation:", platformImpl.address);

  const initPlatformData = encodeFunctionData({
    abi: platformImpl.abi,
    functionName: "initialize",
    args: [platformConfigAdmin],
  });

  const platformProxy = await ctx.viem.deployContract("PlatformConfigProxy", [platformImpl.address, initPlatformData]);
  console.log("PlatformConfig proxy:", platformProxy.address);

  const routerRole = (await ctx.publicClient.readContract({
    address: vault.address,
    abi: vault.abi,
    functionName: "ROUTER_ROLE",
    args: [],
  })) as `0x${string}`;
  const grantTx = await ctx.deployer.writeContract({
    address: vault.address,
    abi: vault.abi,
    functionName: "grantRole",
    args: [routerRole, routerProxy.address],
  });
  await ctx.publicClient.waitForTransactionReceipt({ hash: grantTx });
  console.log("Granted ROUTER_ROLE on SettlementVault to PaymentRouter proxy");

  const record: DeploymentRecord = {
    network: ctx.networkName,
    chainId,
    deployedAt: new Date().toISOString(),
    deployer: deployerAddress,
    admin,
    settlementVault: vault.address,
    paymentRouter: routerProxy.address,
    paymentRouterImplementation: routerImpl.address,
    platformConfig: platformProxy.address,
    platformConfigImplementation: platformImpl.address,
    paymentConfig: {
      paymentToken,
      chainId,
    },
    platformConfigAdmin,
  };

  await saveDeployment(record as DeploymentRecord);

  console.log("");
  console.log("--- Record for backend / admin config ---");
  console.log(JSON.stringify(record, null, 2));
  console.log("");
  console.log("Explorer:", preset.explorerTxBase);

  return { record, preset };
}
