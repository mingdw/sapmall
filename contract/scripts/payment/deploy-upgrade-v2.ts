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

/**
 * 升级部署脚本 V2
 * - 重新部署 SettlementVault（不可升级）
 * - 部署新的 PaymentRouter 实现
 * - 升级 PaymentRouter Proxy
 * - 重新授权 ROUTER_ROLE
 */
export async function deployPaymentV2(ctx: DeployContext) {
  const chainId = await ctx.publicClient.getChainId();
  const preset = resolvePresetByChainId(chainId);
  if (!preset) {
    throw new Error(`No preset for chainId=${chainId}. Add it to scripts/payment/networkDefaults.ts`);
  }

  const deployerAddress = ctx.deployer.account.address;
  const admin = (process.env.PAYMENT_ADMIN as `0x${string}` | undefined) ?? deployerAddress;
  const platformConfigAdmin = (process.env.PLATFORM_CONFIG_ADMIN as `0x${string}` | undefined) ?? admin;
  const paymentToken = (process.env.PAYMENT_USDC_ADDRESS as `0x${string}` | undefined) ?? preset.usdcAddress;

  console.log("=== Payment V2 Upgrade Deployment ===");
  console.log("  network:", ctx.networkName);
  console.log("  chainId:", chainId);
  console.log("  deployer:", deployerAddress);
  console.log("  PAYMENT_ADMIN:", admin);
  console.log("  paymentToken:", paymentToken);

  // Step 1: Deploy new SettlementVault
  console.log("\n[Step 1] Deploying new SettlementVault...");
  const vault = await ctx.viem.deployContract("SettlementVault", [admin]);
  console.log("  SettlementVault:", vault.address);

  // Step 2: Deploy new PaymentRouter implementation
  console.log("\n[Step 2] Deploying new PaymentRouter implementation...");
  const routerImpl = await ctx.viem.deployContract("PaymentRouter");
  console.log("  PaymentRouter V2 implementation:", routerImpl.address);

  // Step 3: Get existing proxy address (from env or previous deployment)
  const existingProxyAddress = process.env.EXISTING_PAYMENT_ROUTER_PROXY as `0x${string}` | undefined;
  
  if (existingProxyAddress) {
    console.log("\n[Step 3] Upgrading existing PaymentRouter proxy...");
    console.log("  Existing proxy:", existingProxyAddress);
    
    // Upgrade the proxy to new implementation
    const upgradeTx = await ctx.deployer.writeContract({
      address: existingProxyAddress,
      abi: routerImpl.abi,
      functionName: "upgradeToAndCall",
      args: [routerImpl.address, "0x"],
    });
    await ctx.publicClient.waitForTransactionReceipt({ hash: upgradeTx });
    console.log("  Proxy upgraded to V2 implementation");

    // Update settlement vault reference
    console.log("\n[Step 4] Updating SettlementVault reference...");
    const setVaultTx = await ctx.deployer.writeContract({
      address: existingProxyAddress,
      abi: routerImpl.abi,
      functionName: "setSettlementVault",
      args: [vault.address],
    });
    await ctx.publicClient.waitForTransactionReceipt({ hash: setVaultTx });
    console.log("  SettlementVault reference updated");

    // Grant ROUTER_ROLE to proxy on new vault
    console.log("\n[Step 5] Granting ROUTER_ROLE...");
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
      args: [routerRole, existingProxyAddress],
    });
    await ctx.publicClient.waitForTransactionReceipt({ hash: grantTx });
    console.log("  ROUTER_ROLE granted to proxy");

    const record: DeploymentRecord = {
      network: ctx.networkName,
      chainId,
      deployedAt: new Date().toISOString(),
      deployer: deployerAddress,
      admin,
      settlementVault: vault.address,
      paymentRouter: existingProxyAddress,
      paymentRouterImplementation: routerImpl.address,
      platformConfig: "0x0000000000000000000000000000000000000000", // Keep existing
      platformConfigImplementation: "0x0000000000000000000000000000000000000000",
      paymentConfig: {
        paymentToken,
        chainId,
      },
      platformConfigAdmin,
    };

    await saveDeployment(record);

    console.log("\n=== Deployment Complete ===");
    console.log(JSON.stringify(record, null, 2));

    return { record, preset };
  } else {
    // Fresh deployment
    console.log("\n[Step 3] Deploying new PaymentRouter proxy...");
    const initRouterData = encodeFunctionData({
      abi: routerImpl.abi,
      functionName: "initialize",
      args: [admin, vault.address],
    });

    const routerProxy = await ctx.viem.deployContract("PaymentRouterProxy", [routerImpl.address, initRouterData]);
    console.log("  PaymentRouter proxy:", routerProxy.address);

    // Add token to whitelist
    console.log("\n[Step 4] Adding USDC to whitelist...");
    const addTokenTx = await ctx.deployer.writeContract({
      address: routerProxy.address,
      abi: routerImpl.abi,
      functionName: "addToken",
      args: [BigInt(chainId), paymentToken, 6, "USDC"],
    });
    await ctx.publicClient.waitForTransactionReceipt({ hash: addTokenTx });
    console.log("  USDC added to whitelist");

    // Grant ROUTER_ROLE
    console.log("\n[Step 5] Granting ROUTER_ROLE...");
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
    console.log("  ROUTER_ROLE granted");

    // Deploy PlatformConfig if needed
    let platformConfigAddress: `0x${string}` = "0x0000000000000000000000000000000000000000";
    let platformConfigImplAddress: `0x${string}` = "0x0000000000000000000000000000000000000000";

    if (process.env.DEPLOY_PLATFORM_CONFIG === "true") {
      console.log("\n[Step 6] Deploying PlatformConfig...");
      const platformImpl = await ctx.viem.deployContract("PlatformConfig");
      platformConfigImplAddress = platformImpl.address;

      const initPlatformData = encodeFunctionData({
        abi: platformImpl.abi,
        functionName: "initialize",
        args: [platformConfigAdmin],
      });

      const platformProxy = await ctx.viem.deployContract("PlatformConfigProxy", [platformImpl.address, initPlatformData]);
      platformConfigAddress = platformProxy.address;
      console.log("  PlatformConfig proxy:", platformConfigAddress);
    }

    const record: DeploymentRecord = {
      network: ctx.networkName,
      chainId,
      deployedAt: new Date().toISOString(),
      deployer: deployerAddress,
      admin,
      settlementVault: vault.address,
      paymentRouter: routerProxy.address,
      paymentRouterImplementation: routerImpl.address,
      platformConfig: platformConfigAddress,
      platformConfigImplementation: platformConfigImplAddress,
      paymentConfig: {
        paymentToken,
        chainId,
      },
      platformConfigAdmin,
    };

    await saveDeployment(record);

    console.log("\n=== Deployment Complete ===");
    console.log(JSON.stringify(record, null, 2));
    console.log("\nExplorer:", preset.explorerTxBase);

    return { record, preset };
  }
}
