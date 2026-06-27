import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";
import { encodeFunctionData, keccak256, toBytes } from "viem";

describe("PaymentRouter + SettlementVault", async function () {
  const connection = await network.create();
  const { viem } = connection;
  const [admin, payer] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  async function waitForTx(hash: `0x${string}`) {
    await publicClient.waitForTransactionReceipt({ hash });
  }

  async function deployPaymentStack() {
    const chainId = BigInt(await publicClient.getChainId());
    const usdc = await viem.deployContract("MockUSDC");
    const vault = await viem.deployContract("SettlementVault", [admin.account.address]);
    const routerImpl = await viem.deployContract("PaymentRouter");
    const initData = encodeFunctionData({
      abi: routerImpl.abi,
      functionName: "initialize",
      args: [admin.account.address, vault.address],
    });
    const routerProxy = await viem.deployContract("PaymentRouterProxy", [routerImpl.address, initData]);
    const router = await viem.getContractAt("PaymentRouter", routerProxy.address);

    await waitForTx(
      await admin.writeContract({
        address: vault.address,
        abi: vault.abi,
        functionName: "grantRole",
        args: [await vault.read.ROUTER_ROLE(), router.address],
      }),
    );

    await waitForTx(
      await admin.writeContract({
        address: router.address,
        abi: router.abi,
        functionName: "addToken",
        args: [chainId, usdc.address, 6, "USDC"],
      }),
    );

    return { usdc, vault, router, chainId };
  }

  it("pays order and marks intent as paid", async function () {
    const { usdc, vault, router } = await deployPaymentStack();
    const amount = 1_000_000n;
    const intentId = "opi_11111111-1111-4111-8111-111111111111";
    const orderRef = "ORD-2026-0001";

    await usdc.write.mint([payer.account.address, amount]);
    await waitForTx(
      await payer.writeContract({
        address: usdc.address,
        abi: usdc.abi,
        functionName: "approve",
        args: [router.address, amount],
      }),
    );

    await waitForTx(
      await payer.writeContract({
        address: router.address,
        abi: router.abi,
        functionName: "payOrder",
        args: [intentId, orderRef, usdc.address, amount],
      }),
    );

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

  it("reverts when token is not in whitelist", async function () {
    const { router } = await deployPaymentStack();
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

  it("supports multiple tokens via whitelist", async function () {
    const { usdc, vault, router, chainId } = await deployPaymentStack();
    const usdt = await viem.deployContract("MockUSDC");
    const amount = 1_000_000n;
    const intentId1 = "opi_multi1-7777-4777-8777-777777777777";
    const intentId2 = "opi_multi2-8888-4888-8888-888888888888";
    const orderRef = "ORD-MULTI";

    await waitForTx(
      await admin.writeContract({
        address: router.address,
        abi: router.abi,
        functionName: "addToken",
        args: [chainId, usdt.address, 6, "USDT"],
      }),
    );

    await usdc.write.mint([payer.account.address, amount]);
    await usdt.write.mint([payer.account.address, amount]);

    await payer.writeContract({
      address: usdc.address,
      abi: usdc.abi,
      functionName: "approve",
      args: [router.address, amount],
    });
    await payer.writeContract({
      address: usdt.address,
      abi: usdt.abi,
      functionName: "approve",
      args: [router.address, amount],
    });

    await waitForTx(
      await payer.writeContract({
        address: router.address,
        abi: router.abi,
        functionName: "payOrder",
        args: [intentId1, orderRef, usdc.address, amount],
      }),
    );

    await waitForTx(
      await payer.writeContract({
        address: router.address,
        abi: router.abi,
        functionName: "payOrder",
        args: [intentId2, orderRef, usdt.address, amount],
      }),
    );

    assert.equal(await router.read.isIntentPaid([intentId1]), true);
    assert.equal(await router.read.isIntentPaid([intentId2]), true);
    assert.equal(await usdc.read.balanceOf([vault.address]), amount);
    assert.equal(await usdt.read.balanceOf([vault.address]), amount);
  });

  it("can disable and re-enable token", async function () {
    const { usdc, router, chainId } = await deployPaymentStack();
    const amount = 100_000n;
    const intentId = "opi_disable-9999-4999-8999-999999999999";
    const orderRef = "ORD-DISABLE";

    await usdc.write.mint([payer.account.address, amount * 2n]);
    await payer.writeContract({
      address: usdc.address,
      abi: usdc.abi,
      functionName: "approve",
      args: [router.address, amount * 2n],
    });

    await waitForTx(
      await payer.writeContract({
        address: router.address,
        abi: router.abi,
        functionName: "payOrder",
        args: [intentId, orderRef, usdc.address, amount],
      }),
    );

    await waitForTx(
      await admin.writeContract({
        address: router.address,
        abi: router.abi,
        functionName: "setTokenStatus",
        args: [chainId, usdc.address, false],
      }),
    );

    await assert.rejects(
      payer.writeContract({
        address: router.address,
        abi: router.abi,
        functionName: "payOrder",
        args: ["opi_disabled-aaaa-4aaa-8aaa-aaaaaaaaaaaa", "ORD-DIS", usdc.address, amount],
      }),
    );

    await waitForTx(
      await admin.writeContract({
        address: router.address,
        abi: router.abi,
        functionName: "setTokenStatus",
        args: [chainId, usdc.address, true],
      }),
    );

    await waitForTx(
      await payer.writeContract({
        address: router.address,
        abi: router.abi,
        functionName: "payOrder",
        args: ["opi_reenabled-bbbb-4bbb-8bbb-bbbbbbbbbbbb", "ORD-REEN", usdc.address, amount],
      }),
    );

    assert.equal(await router.read.isIntentPaid(["opi_reenabled-bbbb-4bbb-8bbb-bbbbbbbbbbbb"]), true);
  });

  it("can query token config", async function () {
    const { usdc, router, chainId } = await deployPaymentStack();

    const isSupported = await router.read.isTokenSupported([chainId, usdc.address]);
    assert.equal(isSupported, true);

    const config = await router.read.getTokenConfig([chainId, usdc.address]);
    assert.equal(config.tokenAddress.toLowerCase(), usdc.address.toLowerCase());
    assert.equal(config.decimals, 6);
    assert.equal(config.isActive, true);
    assert.equal(config.symbol, "USDC");
  });
});
