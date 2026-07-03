import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";
import { encodeFunctionData, keccak256, toBytes } from "viem";

describe("PaymentRouter + SettlementVault", async function () {
  const connection = await network.create();
  const { viem } = connection;
  const [admin, payer, seller, other] = await viem.getWalletClients();
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

  async function payOrderHelper(
    router: any,
    usdc: any,
    payerClient: any,
    sellerAddress: string,
    intentId: string,
    orderRef: string,
    amount: bigint,
  ) {
    await usdc.write.mint([payerClient.account.address, amount]);
    await waitForTx(
      await payerClient.writeContract({
        address: usdc.address,
        abi: usdc.abi,
        functionName: "approve",
        args: [router.address, amount],
      }),
    );
    await waitForTx(
      await payerClient.writeContract({
        address: router.address,
        abi: router.abi,
        functionName: "payOrder",
        args: [intentId, orderRef, sellerAddress, usdc.address, amount],
      }),
    );
  }

  // ==================== PaymentRouter Tests ====================

  describe("PaymentRouter", function () {
    it("pays order and marks intent as paid", async function () {
      const { usdc, vault, router } = await deployPaymentStack();
      const amount = 1_000_000n;
      const intentId = "opi_11111111-1111-4111-8111-111111111111";
      const orderRef = "ORD-2026-0001";

      await payOrderHelper(router, usdc, payer, seller.account.address, intentId, orderRef, amount);

      assert.equal(await router.read.isIntentPaid([intentId]), true);
      assert.equal(await usdc.read.balanceOf([vault.address]), amount);
    });

    it("reverts on duplicate intent", async function () {
      const { usdc, router } = await deployPaymentStack();
      const amount = 500_000n;
      const intentId = "opi_22222222-2222-4222-8222-222222222222";
      const orderRef = "ORD-DUP";

      await payOrderHelper(router, usdc, payer, seller.account.address, intentId, orderRef, amount);

      await assert.rejects(
        payer.writeContract({
          address: router.address,
          abi: router.abi,
          functionName: "payOrder",
          args: [intentId, orderRef, seller.account.address, usdc.address, amount],
        }),
      );
    });

    it("reverts when token is not in whitelist", async function () {
      const { router } = await deployPaymentStack();
      const otherToken = await viem.deployContract("MockUSDC");
      const amount = 100_000n;

      await otherToken.write.mint([payer.account.address, amount]);
      await payer.writeContract({
        address: otherToken.address,
        abi: otherToken.abi,
        functionName: "approve",
        args: [router.address, amount],
      });

      await assert.rejects(
        payer.writeContract({
          address: router.address,
          abi: router.abi,
          functionName: "payOrder",
          args: ["opi_badtoken-3333-4333-8333-333333333333", "ORD-BAD", seller.account.address, otherToken.address, amount],
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
          args: ["opi_noapprove-4444-4444-8444-444444444444", "ORD-NOAPP", seller.account.address, usdc.address, amount],
        }),
      );
    });

    it("reverts when seller is zero address", async function () {
      const { usdc, router } = await deployPaymentStack();
      const amount = 100_000n;
      const zeroAddress = "0x0000000000000000000000000000000000000000";

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
          args: ["opi_noseller-5555-4555-8555-555555555555", "ORD-NOSELL", zeroAddress, usdc.address, amount],
        }),
      );
    });

    it("emits PaymentPaid event and order is paid", async function () {
      const { usdc, vault, router } = await deployPaymentStack();
      const amount = 250_000n;
      const intentId = "opi_evt-6666-4666-8666-666666666666";
      const orderRef = "ORD-EVT";

      await payOrderHelper(router, usdc, payer, seller.account.address, intentId, orderRef, amount);

      // 验证订单已支付
      assert.equal(await router.read.isIntentPaid([intentId]), true);
      // 验证资金在金库中
      assert.equal(await usdc.read.balanceOf([vault.address]), amount);
      // 验证订单状态为 Paid (1)
      assert.equal(Number(await vault.read.getOrderStatus([intentId])), 1);
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
          args: [intentId1, orderRef, seller.account.address, usdc.address, amount],
        }),
      );

      await waitForTx(
        await payer.writeContract({
          address: router.address,
          abi: router.abi,
          functionName: "payOrder",
          args: [intentId2, orderRef, seller.account.address, usdt.address, amount],
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
          args: [intentId, orderRef, seller.account.address, usdc.address, amount],
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
          args: ["opi_disabled-aaaa-4aaa-8aaa-aaaaaaaaaaaa", "ORD-DIS", seller.account.address, usdc.address, amount],
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
          args: ["opi_reenabled-bbbb-4bbb-8bbb-bbbbbbbbbbbb", "ORD-REEN", seller.account.address, usdc.address, amount],
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

  // ==================== SettlementVault Tests ====================

  describe("SettlementVault - Order Lifecycle", function () {
    it("confirms order by payer", async function () {
      const { usdc, vault, router } = await deployPaymentStack();
      const amount = 1_000_000n;
      const intentId = "opi_confirm-1111-4111-8111-111111111111";
      const orderRef = "ORD-CONFIRM";

      await payOrderHelper(router, usdc, payer, seller.account.address, intentId, orderRef, amount);

      // 买家确认收货
      await waitForTx(
        await payer.writeContract({
          address: vault.address,
          abi: vault.abi,
          functionName: "confirmOrder",
          args: [intentId],
        }),
      );

      // 验证订单状态为 Confirmed (2)
      const status = await vault.read.getOrderStatus([intentId]);
      assert.equal(Number(status), 2);
    });

    it("reverts confirm if not payer", async function () {
      const { usdc, vault, router } = await deployPaymentStack();
      const amount = 1_000_000n;
      const intentId = "opi_confirm-2222-4222-8222-222222222222";
      const orderRef = "ORD-CONF-NOTPAY";

      await payOrderHelper(router, usdc, payer, seller.account.address, intentId, orderRef, amount);

      // 卖家尝试确认（应该失败）
      await assert.rejects(
        seller.writeContract({
          address: vault.address,
          abi: vault.abi,
          functionName: "confirmOrder",
          args: [intentId],
        }),
      );
    });

    it("reverts confirm on non-existent order", async function () {
      const { vault } = await deployPaymentStack();
      const intentId = "opi_nonexist-3333-4333-8333-333333333333";

      await assert.rejects(
        payer.writeContract({
          address: vault.address,
          abi: vault.abi,
          functionName: "confirmOrder",
          args: [intentId],
        }),
      );
    });

    it("reverts confirm if already confirmed", async function () {
      const { usdc, vault, router } = await deployPaymentStack();
      const amount = 1_000_000n;
      const intentId = "opi_confirm-4444-4444-8444-444444444444";
      const orderRef = "ORD-CONF-DUP";

      await payOrderHelper(router, usdc, payer, seller.account.address, intentId, orderRef, amount);

      // 第一次确认
      await waitForTx(
        await payer.writeContract({
          address: vault.address,
          abi: vault.abi,
          functionName: "confirmOrder",
          args: [intentId],
        }),
      );

      // 第二次确认（应该失败）
      await assert.rejects(
        payer.writeContract({
          address: vault.address,
          abi: vault.abi,
          functionName: "confirmOrder",
          args: [intentId],
        }),
      );
    });

    it("emits OrderConfirmed event", async function () {
      const { usdc, vault, router } = await deployPaymentStack();
      const amount = 1_000_000n;
      const intentId = "opi_confirm-5555-4555-8555-555555555555";
      const orderRef = "ORD-CONF-EVT";

      await payOrderHelper(router, usdc, payer, seller.account.address, intentId, orderRef, amount);

      const tx = await payer.writeContract({
        address: vault.address,
        abi: vault.abi,
        functionName: "confirmOrder",
        args: [intentId],
      });
      const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });

      const eventTopic = keccak256(toBytes("OrderConfirmed(string,address,uint256)"));
      const log = receipt.logs.find((l) => l.topics[0] === eventTopic);
      assert.ok(log);
      assert.equal(log.topics[1], keccak256(toBytes(intentId)));
    });
  });

  describe("SettlementVault - Release", function () {
    it("releases funds to seller after confirmation", async function () {
      const { usdc, vault, router } = await deployPaymentStack();
      const amount = 1_000_000n;
      const intentId = "opi_release-1111-4111-8111-111111111111";
      const orderRef = "ORD-RELEASE";

      await payOrderHelper(router, usdc, payer, seller.account.address, intentId, orderRef, amount);

      // 买家确认
      await waitForTx(
        await payer.writeContract({
          address: vault.address,
          abi: vault.abi,
          functionName: "confirmOrder",
          args: [intentId],
        }),
      );

      // 管理员释放资金
      await waitForTx(
        await admin.writeContract({
          address: vault.address,
          abi: vault.abi,
          functionName: "release",
          args: [intentId],
        }),
      );

      // 验证卖家收到资金
      assert.equal(await usdc.read.balanceOf([seller.account.address]), amount);
      // 验证金库余额为0
      assert.equal(await usdc.read.balanceOf([vault.address]), 0n);
      // 验证订单状态为 Released (3)
      assert.equal(Number(await vault.read.getOrderStatus([intentId])), 3);
    });

    it("reverts release if not confirmed", async function () {
      const { usdc, vault, router } = await deployPaymentStack();
      const amount = 1_000_000n;
      const intentId = "opi_release-2222-4222-8222-222222222222";
      const orderRef = "ORD-REL-NOTCONF";

      await payOrderHelper(router, usdc, payer, seller.account.address, intentId, orderRef, amount);

      // 未确认就释放（应该失败）
      await assert.rejects(
        admin.writeContract({
          address: vault.address,
          abi: vault.abi,
          functionName: "release",
          args: [intentId],
        }),
      );
    });

    it("reverts release if not operator", async function () {
      const { usdc, vault, router } = await deployPaymentStack();
      const amount = 1_000_000n;
      const intentId = "opi_release-3333-4333-8333-333333333333";
      const orderRef = "ORD-REL-NOTOP";

      await payOrderHelper(router, usdc, payer, seller.account.address, intentId, orderRef, amount);

      await waitForTx(
        await payer.writeContract({
          address: vault.address,
          abi: vault.abi,
          functionName: "confirmOrder",
          args: [intentId],
        }),
      );

      // 非操作员释放（应该失败）
      await assert.rejects(
        other.writeContract({
          address: vault.address,
          abi: vault.abi,
          functionName: "release",
          args: [intentId],
        }),
      );
    });

    it("reverts release on already released order", async function () {
      const { usdc, vault, router } = await deployPaymentStack();
      const amount = 1_000_000n;
      const intentId = "opi_release-4444-4444-8444-444444444444";
      const orderRef = "ORD-REL-DUP";

      await payOrderHelper(router, usdc, payer, seller.account.address, intentId, orderRef, amount);

      await waitForTx(
        await payer.writeContract({
          address: vault.address,
          abi: vault.abi,
          functionName: "confirmOrder",
          args: [intentId],
        }),
      );

      // 第一次释放
      await waitForTx(
        await admin.writeContract({
          address: vault.address,
          abi: vault.abi,
          functionName: "release",
          args: [intentId],
        }),
      );

      // 第二次释放（应该失败）
      await assert.rejects(
        admin.writeContract({
          address: vault.address,
          abi: vault.abi,
          functionName: "release",
          args: [intentId],
        }),
      );
    });

    it("emits FundsReleased event", async function () {
      const { usdc, vault, router } = await deployPaymentStack();
      const amount = 1_000_000n;
      const intentId = "opi_release-5555-4555-8555-555555555555";
      const orderRef = "ORD-REL-EVT";

      await payOrderHelper(router, usdc, payer, seller.account.address, intentId, orderRef, amount);

      await waitForTx(
        await payer.writeContract({
          address: vault.address,
          abi: vault.abi,
          functionName: "confirmOrder",
          args: [intentId],
        }),
      );

      const tx = await admin.writeContract({
        address: vault.address,
        abi: vault.abi,
        functionName: "release",
        args: [intentId],
      });
      const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });

      const eventTopic = keccak256(toBytes("FundsReleased(string,address,address,uint256,uint256)"));
      const log = receipt.logs.find((l) => l.topics[0] === eventTopic);
      assert.ok(log);
      assert.equal(log.topics[1], keccak256(toBytes(intentId)));
      const paddedSeller = `0x${seller.account.address.slice(2).padStart(64, "0")}`.toLowerCase();
      assert.equal(log.topics[2]?.toLowerCase(), paddedSeller);
    });
  });

  describe("SettlementVault - Refund", function () {
    it("refunds funds to payer", async function () {
      const { usdc, vault, router } = await deployPaymentStack();
      const amount = 1_000_000n;
      const intentId = "opi_refund-1111-4111-8111-111111111111";
      const orderRef = "ORD-REFUND";

      await payOrderHelper(router, usdc, payer, seller.account.address, intentId, orderRef, amount);

      const payerBalanceBefore = await usdc.read.balanceOf([payer.account.address]);

      // 管理员退款
      await waitForTx(
        await admin.writeContract({
          address: vault.address,
          abi: vault.abi,
          functionName: "refund",
          args: [intentId],
        }),
      );

      // 验证买家收到退款
      const payerBalanceAfter = await usdc.read.balanceOf([payer.account.address]);
      assert.equal(payerBalanceAfter - payerBalanceBefore, amount);
      // 验证金库余额为0
      assert.equal(await usdc.read.balanceOf([vault.address]), 0n);
      // 验证订单状态为 Refunded (4)
      assert.equal(Number(await vault.read.getOrderStatus([intentId])), 4);
    });

    it("reverts refund if already confirmed", async function () {
      const { usdc, vault, router } = await deployPaymentStack();
      const amount = 1_000_000n;
      const intentId = "opi_refund-2222-4222-8222-222222222222";
      const orderRef = "ORD-REF-AFTERCONF";

      await payOrderHelper(router, usdc, payer, seller.account.address, intentId, orderRef, amount);

      // 先确认
      await waitForTx(
        await payer.writeContract({
          address: vault.address,
          abi: vault.abi,
          functionName: "confirmOrder",
          args: [intentId],
        }),
      );

      // 已确认的订单不能退款（应该失败）
      await assert.rejects(
        admin.writeContract({
          address: vault.address,
          abi: vault.abi,
          functionName: "refund",
          args: [intentId],
        }),
      );
    });

    it("reverts refund if not operator", async function () {
      const { usdc, vault, router } = await deployPaymentStack();
      const amount = 1_000_000n;
      const intentId = "opi_refund-3333-4333-8333-333333333333";
      const orderRef = "ORD-REF-NOTOP";

      await payOrderHelper(router, usdc, payer, seller.account.address, intentId, orderRef, amount);

      // 非操作员退款（应该失败）
      await assert.rejects(
        other.writeContract({
          address: vault.address,
          abi: vault.abi,
          functionName: "refund",
          args: [intentId],
        }),
      );
    });

    it("reverts refund on non-existent order", async function () {
      const { vault } = await deployPaymentStack();
      const intentId = "opi_nonexist-4444-4444-8444-444444444444";

      await assert.rejects(
        admin.writeContract({
          address: vault.address,
          abi: vault.abi,
          functionName: "refund",
          args: [intentId],
        }),
      );
    });

    it("reverts refund on already refunded order", async function () {
      const { usdc, vault, router } = await deployPaymentStack();
      const amount = 1_000_000n;
      const intentId = "opi_refund-5555-4555-8555-555555555555";
      const orderRef = "ORD-REF-DUP";

      await payOrderHelper(router, usdc, payer, seller.account.address, intentId, orderRef, amount);

      // 第一次退款
      await waitForTx(
        await admin.writeContract({
          address: vault.address,
          abi: vault.abi,
          functionName: "refund",
          args: [intentId],
        }),
      );

      // 第二次退款（应该失败）
      await assert.rejects(
        admin.writeContract({
          address: vault.address,
          abi: vault.abi,
          functionName: "refund",
          args: [intentId],
        }),
      );
    });

    it("emits FundsRefunded event", async function () {
      const { usdc, vault, router } = await deployPaymentStack();
      const amount = 1_000_000n;
      const intentId = "opi_refund-6666-4666-8666-666666666666";
      const orderRef = "ORD-REF-EVT";

      await payOrderHelper(router, usdc, payer, seller.account.address, intentId, orderRef, amount);

      const tx = await admin.writeContract({
        address: vault.address,
        abi: vault.abi,
        functionName: "refund",
        args: [intentId],
      });
      const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });

      const eventTopic = keccak256(toBytes("FundsRefunded(string,address,address,uint256,uint256)"));
      const log = receipt.logs.find((l) => l.topics[0] === eventTopic);
      assert.ok(log);
      assert.equal(log.topics[1], keccak256(toBytes(intentId)));
      const paddedPayer = `0x${payer.account.address.slice(2).padStart(64, "0")}`.toLowerCase();
      assert.equal(log.topics[2]?.toLowerCase(), paddedPayer);
    });
  });

  describe("SettlementVault - Query Functions", function () {
    it("returns correct order details", async function () {
      const { usdc, vault, router } = await deployPaymentStack();
      const amount = 1_000_000n;
      const intentId = "opi_query-1111-4111-8111-111111111111";
      const orderRef = "ORD-QUERY";

      await payOrderHelper(router, usdc, payer, seller.account.address, intentId, orderRef, amount);

      const order = await vault.read.getOrder([intentId]);
      assert.equal(order.intentId, intentId);
      assert.equal(order.orderRef, orderRef);
      assert.equal(order.payer.toLowerCase(), payer.account.address.toLowerCase());
      assert.equal(order.seller.toLowerCase(), seller.account.address.toLowerCase());
      assert.equal(order.token.toLowerCase(), usdc.address.toLowerCase());
      assert.equal(order.amount, amount);
      assert.equal(Number(order.status), 1); // Paid
    });

    it("returns None status for non-existent order", async function () {
      const { vault } = await deployPaymentStack();
      const intentId = "opi_nonexist-2222-4222-8222-222222222222";

      const status = await vault.read.getOrderStatus([intentId]);
      assert.equal(Number(status), 0); // None
    });

    it("isOrderPaid returns correct values", async function () {
      const { usdc, vault, router } = await deployPaymentStack();
      const amount = 1_000_000n;
      const intentId = "opi_query-3333-4333-8333-333333333333";
      const orderRef = "ORD-ISP";

      // 未付款前
      assert.equal(await vault.read.isOrderPaid([intentId]), false);

      await payOrderHelper(router, usdc, payer, seller.account.address, intentId, orderRef, amount);

      // 付款后
      assert.equal(await vault.read.isOrderPaid([intentId]), true);
    });
  });

  describe("SettlementVault - Pausable", function () {
    it("reverts operations when paused", async function () {
      const { usdc, vault, router } = await deployPaymentStack();
      const amount = 1_000_000n;
      const intentId = "opi_pause-1111-4111-8111-111111111111";
      const orderRef = "ORD-PAUSE";

      await payOrderHelper(router, usdc, payer, seller.account.address, intentId, orderRef, amount);

      // 暂停合约
      await waitForTx(
        await admin.writeContract({
          address: vault.address,
          abi: vault.abi,
          functionName: "pause",
          args: [],
        }),
      );

      // 确认订单应该失败
      await assert.rejects(
        payer.writeContract({
          address: vault.address,
          abi: vault.abi,
          functionName: "confirmOrder",
          args: [intentId],
        }),
      );

      // 取消暂停
      await waitForTx(
        await admin.writeContract({
          address: vault.address,
          abi: vault.abi,
          functionName: "unpause",
          args: [],
        }),
      );

      // 现在可以确认了
      await waitForTx(
        await payer.writeContract({
          address: vault.address,
          abi: vault.abi,
          functionName: "confirmOrder",
          args: [intentId],
        }),
      );

      assert.equal(Number(await vault.read.getOrderStatus([intentId])), 2);
    });
  });
});
