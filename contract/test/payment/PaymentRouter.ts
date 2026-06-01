import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";
import { encodeFunctionData, keccak256, toBytes } from "viem";

const CFG_PAYMENT_TOKEN_USDC = "payment.token.usdc";
const CFG_PAYMENT_CHAIN_ID = "payment.chain.id";

describe("PaymentRouter + SettlementVault", async function () {
  const connection = await network.create();
  const { viem } = connection;
  const [admin, payer] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  async function waitForTx(hash: `0x${string}`) {
    await publicClient.waitForTransactionReceipt({ hash });
  }

  async function deployPlatformConfig() {
    const implementation = await viem.deployContract("PlatformConfig");
    const initData = encodeFunctionData({
      abi: implementation.abi,
      functionName: "initialize",
      args: [admin.account.address],
    });
    const proxy = await viem.deployContract("PlatformConfigProxy", [
      implementation.address,
      initData,
    ]);
    return viem.getContractAt("PlatformConfig", proxy.address);
  }

  async function createPaymentConfig(
    config: Awaited<ReturnType<typeof deployPlatformConfig>>,
    usdcAddress: `0x${string}`,
    chainId: bigint,
  ) {
    const createUsdcTx = await admin.writeContract({
      address: config.address,
      abi: config.abi,
      functionName: "createConfig",
      args: [CFG_PAYMENT_TOKEN_USDC, usdcAddress, "address", "order payment USDC", 0],
    });
    await waitForTx(createUsdcTx);

    const createChainTx = await admin.writeContract({
      address: config.address,
      abi: config.abi,
      functionName: "createConfig",
      args: [CFG_PAYMENT_CHAIN_ID, chainId.toString(), "number", "expected chain id", 0],
    });
    await waitForTx(createChainTx);
  }

  async function deployPaymentStack() {
    const chainId = BigInt(await publicClient.getChainId());
    const config = await deployPlatformConfig();
    const usdc = await viem.deployContract("MockUSDC");

    await createPaymentConfig(config, usdc.address, chainId);

    const vault = await viem.deployContract("SettlementVault", [admin.account.address]);

    const routerImpl = await viem.deployContract("PaymentRouter");
    const initData = encodeFunctionData({
      abi: routerImpl.abi,
      functionName: "initialize",
      args: [admin.account.address, config.address, vault.address],
    });
    const routerProxy = await viem.deployContract("PaymentRouterProxy", [
      routerImpl.address,
      initData,
    ]);
    const router = await viem.getContractAt("PaymentRouter", routerProxy.address);

    const grantTx = await admin.writeContract({
      address: vault.address,
      abi: vault.abi,
      functionName: "grantRole",
      args: [await vault.read.ROUTER_ROLE(), router.address],
    });
    await waitForTx(grantTx);

    return { config, usdc, vault, router, chainId };
  }

  it("pays order and marks intent as paid", async function () {
    const { usdc, vault, router } = await deployPaymentStack();
    const amount = 1_000_000n; // 1 USDC
    const intentId = "opi_11111111-1111-4111-8111-111111111111";
    const orderRef = "ORD-2026-0001";

    const mintTx = await usdc.write.mint([payer.account.address, amount]);
    await waitForTx(mintTx);

    const approveTx = await payer.writeContract({
      address: usdc.address,
      abi: usdc.abi,
      functionName: "approve",
      args: [router.address, amount],
    });
    await waitForTx(approveTx);

    const payTx = await payer.writeContract({
      address: router.address,
      abi: router.abi,
      functionName: "payOrder",
      args: [intentId, orderRef, usdc.address, amount],
    });
    await waitForTx(payTx);

    assert.equal(await router.read.isIntentPaid([intentId]), true);
    assert.equal(await usdc.read.balanceOf([vault.address]), amount);
  });

  it("reverts on duplicate intent", async function () {
    const { usdc, router } = await deployPaymentStack();
    const amount = 500_000n;
    const intentId = "opi_22222222-2222-4222-8222-222222222222";
    const orderRef = "ORD-DUP";

    await usdc.write.mint([payer.account.address, amount * 2n]);
    await payer.writeContract({
      address: usdc.address,
      abi: usdc.abi,
      functionName: "approve",
      args: [router.address, amount * 2n],
    });

    await payer.writeContract({
      address: router.address,
      abi: router.abi,
      functionName: "payOrder",
      args: [intentId, orderRef, usdc.address, amount],
    });

    await assert.rejects(
      payer.writeContract({
        address: router.address,
        abi: router.abi,
        functionName: "payOrder",
        args: [intentId, orderRef, usdc.address, amount],
      }),
    );
  });

  it("reverts when token is not configured USDC", async function () {
    const { usdc, router } = await deployPaymentStack();
    const other = await viem.deployContract("MockUSDC");
    const amount = 100_000n;

    await other.write.mint([payer.account.address, amount]);
    await payer.writeContract({
      address: other.address,
      abi: other.abi,
      functionName: "approve",
      args: [router.address, amount],
    });

    await assert.rejects(
      payer.writeContract({
        address: router.address,
        abi: router.abi,
        functionName: "payOrder",
        args: ["opi_badtoken-3333-4333-8333-333333333333", "ORD-BAD", other.address, amount],
      }),
    );

    assert.equal(await usdc.read.balanceOf([router.address]), 0n);
  });

  it("reverts without approve", async function () {
    const { usdc, router } = await deployPaymentStack();
    const amount = 100_000n;
    await usdc.write.mint([payer.account.address, amount]);

    await assert.rejects(
      payer.writeContract({
        address: router.address,
        abi: router.abi,
        functionName: "payOrder",
        args: ["opi_noapprove-4444-4444-8444-444444444444", "ORD-NOAPP", usdc.address, amount],
      }),
    );
  });

  it("reverts when chain id config mismatches", async function () {
    const config = await deployPlatformConfig();
    const usdc = await viem.deployContract("MockUSDC");
    const wrongChainId = 999999n;
    await createPaymentConfig(config, usdc.address, wrongChainId);

    const vault = await viem.deployContract("SettlementVault", [admin.account.address]);
    const routerImpl = await viem.deployContract("PaymentRouter");
    const initData = encodeFunctionData({
      abi: routerImpl.abi,
      functionName: "initialize",
      args: [admin.account.address, config.address, vault.address],
    });
    const routerProxy = await viem.deployContract("PaymentRouterProxy", [
      routerImpl.address,
      initData,
    ]);
    const router = await viem.getContractAt("PaymentRouter", routerProxy.address);

    const routerRole = await vault.read.ROUTER_ROLE();
    await waitForTx(
      await admin.writeContract({
        address: vault.address,
        abi: vault.abi,
        functionName: "grantRole",
        args: [routerRole, router.address],
      }),
    );

    const amount = 100_000n;
    await usdc.write.mint([payer.account.address, amount]);
    await payer.writeContract({
      address: usdc.address,
      abi: usdc.abi,
      functionName: "approve",
      args: [router.address, amount],
    });

    await assert.rejects(
      payer.writeContract({
        address: router.address,
        abi: router.abi,
        functionName: "payOrder",
        args: ["opi_chain-5555-4555-8555-555555555555", "ORD-CHAIN", usdc.address, amount],
      }),
    );
  });

  it("release reverts SettlementNotEnabled", async function () {
    const { vault } = await deployPaymentStack();
    await assert.rejects(
      admin.writeContract({
        address: vault.address,
        abi: vault.abi,
        functionName: "release",
        args: [admin.account.address, admin.account.address, 1n],
      }),
    );
  });

  it("emits PaymentPaid with three indexed topics for strings and payer", async function () {
    const { usdc, router } = await deployPaymentStack();
    const amount = 250_000n;
    const intentId = "opi_evt-6666-4666-8666-666666666666";
    const orderRef = "ORD-EVT";

    await usdc.write.mint([payer.account.address, amount]);
    await payer.writeContract({
      address: usdc.address,
      abi: usdc.abi,
      functionName: "approve",
      args: [router.address, amount],
    });

    const payTx = await payer.writeContract({
      address: router.address,
      abi: router.abi,
      functionName: "payOrder",
      args: [intentId, orderRef, usdc.address, amount],
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash: payTx });

    const paidTopic = keccak256(toBytes("PaymentPaid(string,string,address,address,uint256,uint256)"));
    const log = receipt.logs.find((l) => l.topics[0] === paidTopic);
    assert.ok(log);
    assert.equal(log.topics[1], keccak256(toBytes(intentId)));
    assert.equal(log.topics[2], keccak256(toBytes(orderRef)));
    const paddedPayer = `0x${payer.account.address.slice(2).padStart(64, "0")}`.toLowerCase();
    assert.equal(log.topics[3]?.toLowerCase(), paddedPayer);
  });
});
