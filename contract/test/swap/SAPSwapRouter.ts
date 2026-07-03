import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import { network } from "hardhat";
import { parseUnits, parseEther, keccak256, toBytes, zeroAddress, toHex } from "viem";

describe("SAPSwapRouter - Treasury", async function () {
  const { viem } = await network.create();
  const [admin, user, , treasury] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  const TREASURY_ROLE = keccak256(toBytes("TREASURY_ROLE"));
  const EXCHANGE_ROLE = keccak256(toBytes("EXCHANGE_ROLE"));

  // Rate: 100 SAP per USDC. Formula: amountOut = amountAfterFee * rateToSAP / 10^decimals
  // For 100 USDC (10^8) → 9900 SAP (9900*10^18): rateToSAP = 100 * 10^18
  const SWAP_RATE = 100n * 10n ** 18n;
  const FEE_BPS = 100n;

  async function waitForTx(hash: `0x${string}`) {
    await publicClient.waitForTransactionReceipt({ hash });
  }

  async function adminCall(contract: any, fn: string, args: any[] = []) {
    const tx = await admin.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: fn,
      args,
    });
    await waitForTx(tx);
  }

  /**
   * 重置 _initialized 存储 slot 为 0，绕过 _disableInitializers()。
   * OZ v5 使用 ERC-7201 命名空间存储，slot 不在 0，而在：
   * keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.Initializable")) - 1)) & ~bytes32(uint256(0xff))
   */
  const ERC7201_INITIALIZABLE_SLOT = "0xf0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00";

  async function resetInitialized(contractAddress: `0x${string}`) {
    await (publicClient as any).request({
      method: "hardhat_setStorageAt",
      params: [contractAddress, ERC7201_INITIALIZABLE_SLOT, toHex(0, { size: 32 })],
    });
  }

  async function deployAndInit(name: string, initArgs: any[]) {
    const contract = await viem.deployContract(name as any);
    await resetInitialized(contract.address);
    const tx = await admin.writeContract({
      address: contract.address,
      abi: contract.abi,
      functionName: "initialize",
      args: initArgs,
    });
    await waitForTx(tx);
    return contract;
  }

  let sapToken: any;
  let swapRouter: any;
  let usdc: any;

  async function depositStablecoin(amount: string) {
    const swapAmount = parseUnits(amount, 6);
    let tx = await user.writeContract({
      address: usdc.address,
      abi: usdc.abi,
      functionName: "approve",
      args: [swapRouter.address, swapAmount],
    });
    await waitForTx(tx);
    tx = await user.writeContract({
      address: swapRouter.address,
      abi: swapRouter.abi,
      functionName: "swap",
      args: [usdc.address, swapAmount, 0n, 0],
    });
    await waitForTx(tx);
  }

  beforeEach(async function () {
    sapToken = await deployAndInit("SAPToken", ["SAP Token", "SAP", admin.account.address]);
    usdc = await viem.deployContract("MockStablecoin" as any, ["USD Coin", "USDC", 6]);
    swapRouter = await deployAndInit("SAPSwapRouter", [
      admin.account.address,
      sapToken.address,
      admin.account.address,
      FEE_BPS,
    ]);
    await adminCall(sapToken, "grantRole", [EXCHANGE_ROLE, swapRouter.address]);
    await adminCall(swapRouter, "addStablecoin", [usdc.address, 6, "USDC", SWAP_RATE]);
    await adminCall(usdc, "mint", [user.account.address, parseUnits("10000", 6)]);

    // Configure community bucket with 100% TGE so tokens are immediately mintable for testing
    const communityBucket = keccak256(toBytes("community_incentive"));
    const COMMUNITY_CAP = 500_000_000n * 10n ** 18n;
    const start = BigInt(Math.floor(Date.now() / 1000));
    await adminCall(sapToken, "configureBucket", [communityBucket, COMMUNITY_CAP, 10000, start, 0n, 0n]);
  });

  // ============ 基础功能 ============

  describe("基本功能", function () {
    it("应该正确初始化", async function () {
      const tokenAddr = await swapRouter.read.sapToken();
      assert.equal(tokenAddr.toLowerCase(), sapToken.address.toLowerCase());
      const fee = await swapRouter.read.feeBps();
      assert.equal(fee, FEE_BPS);
    });

    it("admin 应拥有 TREASURY_ROLE", async function () {
      const hasRole = await swapRouter.read.hasRole([TREASURY_ROLE, admin.account.address]);
      assert.equal(hasRole, true);
    });
  });

  // ============ 兑换功能 ============

  describe("兑换功能", function () {
    it("应该成功兑换 USDC 为 SAP", async function () {
      const swapAmount = parseUnits("100", 6);
      const expectedSAP = parseUnits("9900", 18);

      let tx = await user.writeContract({
        address: usdc.address,
        abi: usdc.abi,
        functionName: "approve",
        args: [swapRouter.address, swapAmount],
      });
      await waitForTx(tx);

      tx = await user.writeContract({
        address: swapRouter.address,
        abi: swapRouter.abi,
        functionName: "swap",
        args: [usdc.address, swapAmount, expectedSAP, 0],
      });
      await waitForTx(tx);

      const sapBalance = await sapToken.read.balanceOf([user.account.address]);
      assert.equal(sapBalance, expectedSAP);
    });
  });

  // ============ getStablecoinBalance ============

  describe("getStablecoinBalance", function () {
    it("未存入时应返回 0", async function () {
      const balance = await swapRouter.read.getStablecoinBalance([usdc.address]);
      assert.equal(balance, 0n);
    });

    it("兑换后应返回正确的合约余额", async function () {
      await depositStablecoin("1000");
      const expectedBalance = parseUnits("990", 6);
      const balance = await swapRouter.read.getStablecoinBalance([usdc.address]);
      assert.equal(balance, expectedBalance);
    });
  });

  // ============ withdrawStablecoin ============

  describe("withdrawStablecoin - 成功场景", function () {
    it("应该成功提取指定数量的稳定币", async function () {
      await depositStablecoin("1000");
      const withdrawAmount = parseUnits("500", 6);
      const balanceBefore = await usdc.read.balanceOf([treasury.account.address]);

      const tx = await admin.writeContract({
        address: swapRouter.address,
        abi: swapRouter.abi,
        functionName: "withdrawStablecoin",
        args: [usdc.address, withdrawAmount, treasury.account.address],
      });
      await waitForTx(tx);

      const balanceAfter = await usdc.read.balanceOf([treasury.account.address]);
      assert.equal(balanceAfter - balanceBefore, withdrawAmount);
    });

    it("amount=0 时应该提取全部余额", async function () {
      await depositStablecoin("1000");
      const contractBalance = await usdc.read.balanceOf([swapRouter.address]);

      const tx = await admin.writeContract({
        address: swapRouter.address,
        abi: swapRouter.abi,
        functionName: "withdrawStablecoin",
        args: [usdc.address, 0n, treasury.account.address],
      });
      await waitForTx(tx);

      const treasuryBalance = await usdc.read.balanceOf([treasury.account.address]);
      assert.equal(treasuryBalance, contractBalance);
      assert.equal(await usdc.read.balanceOf([swapRouter.address]), 0n);
    });

    it("应该正确更新 totalWithdrawn 统计", async function () {
      await depositStablecoin("1000");
      const amount1 = parseUnits("200", 6);
      const amount2 = parseUnits("300", 6);

      let tx = await admin.writeContract({
        address: swapRouter.address,
        abi: swapRouter.abi,
        functionName: "withdrawStablecoin",
        args: [usdc.address, amount1, treasury.account.address],
      });
      await waitForTx(tx);
      assert.equal(await swapRouter.read.totalWithdrawn([usdc.address]), amount1);

      tx = await admin.writeContract({
        address: swapRouter.address,
        abi: swapRouter.abi,
        functionName: "withdrawStablecoin",
        args: [usdc.address, amount2, treasury.account.address],
      });
      await waitForTx(tx);
      assert.equal(await swapRouter.read.totalWithdrawn([usdc.address]), amount1 + amount2);
    });
  });

  describe("withdrawStablecoin - 权限校验", function () {
    it("应该拒绝没有 TREASURY_ROLE 的地址", async function () {
      await depositStablecoin("1000");
      await assert.rejects(
        async () =>
          user.writeContract({
            address: swapRouter.address,
            abi: swapRouter.abi,
            functionName: "withdrawStablecoin",
            args: [usdc.address, parseUnits("100", 6), user.account.address],
          })
      );
    });
  });

  describe("withdrawStablecoin - 边界条件", function () {
    it("应该拒绝零地址接收", async function () {
      await depositStablecoin("1000");
      await assert.rejects(
        async () =>
          admin.writeContract({
            address: swapRouter.address,
            abi: swapRouter.abi,
            functionName: "withdrawStablecoin",
            args: [usdc.address, parseUnits("100", 6), zeroAddress],
          })
      );
    });

    it("合约无余额时 amount=0 应该 revert", async function () {
      await assert.rejects(
        async () =>
          admin.writeContract({
            address: swapRouter.address,
            abi: swapRouter.abi,
            functionName: "withdrawStablecoin",
            args: [usdc.address, 0n, treasury.account.address],
          })
      );
    });

    it("应该拒绝超出余额的提取金额", async function () {
      await depositStablecoin("1000");
      await assert.rejects(
        async () =>
          admin.writeContract({
            address: swapRouter.address,
            abi: swapRouter.abi,
            functionName: "withdrawStablecoin",
            args: [usdc.address, parseUnits("999999", 6), treasury.account.address],
          })
      );
    });
  });

  describe("withdrawStablecoin - 多代币场景", function () {
    let usdt: any;

    beforeEach(async function () {
      usdt = await viem.deployContract("MockStablecoin" as any, ["Tether", "USDT", 6]);
      await adminCall(swapRouter, "addStablecoin", [usdt.address, 6, "USDT", SWAP_RATE]);
      await adminCall(usdt, "mint", [user.account.address, parseUnits("500", 6)]);
      let tx = await user.writeContract({
        address: usdt.address,
        abi: usdt.abi,
        functionName: "approve",
        args: [swapRouter.address, parseUnits("500", 6)],
      });
      await waitForTx(tx);
      tx = await user.writeContract({
        address: swapRouter.address,
        abi: swapRouter.abi,
        functionName: "swap",
        args: [usdt.address, parseUnits("500", 6), 0n, 0],
      });
      await waitForTx(tx);
      await depositStablecoin("300");
    });

    it("应该独立追踪不同代币的提取统计", async function () {
      let tx = await admin.writeContract({
        address: swapRouter.address,
        abi: swapRouter.abi,
        functionName: "withdrawStablecoin",
        args: [usdc.address, parseUnits("100", 6), treasury.account.address],
      });
      await waitForTx(tx);
      tx = await admin.writeContract({
        address: swapRouter.address,
        abi: swapRouter.abi,
        functionName: "withdrawStablecoin",
        args: [usdt.address, parseUnits("200", 6), treasury.account.address],
      });
      await waitForTx(tx);

      assert.equal(await swapRouter.read.totalWithdrawn([usdc.address]), parseUnits("100", 6));
      assert.equal(await swapRouter.read.totalWithdrawn([usdt.address]), parseUnits("200", 6));
    });

    it("提取一个代币不应影响另一个代币的余额", async function () {
      const usdcBefore = await usdc.read.balanceOf([swapRouter.address]);
      const usdtBefore = await usdt.read.balanceOf([swapRouter.address]);

      const tx = await admin.writeContract({
        address: swapRouter.address,
        abi: swapRouter.abi,
        functionName: "withdrawStablecoin",
        args: [usdc.address, parseUnits("100", 6), treasury.account.address],
      });
      await waitForTx(tx);

      assert.equal(await usdc.read.balanceOf([swapRouter.address]), usdcBefore - parseUnits("100", 6));
      assert.equal(await usdt.read.balanceOf([swapRouter.address]), usdtBefore);
    });
  });

  // ============ withdrawNative ============

  describe("withdrawNative", function () {
    beforeEach(async function () {
      const tx = await admin.sendTransaction({
        to: swapRouter.address,
        value: parseEther("1.0"),
      });
      await waitForTx(tx);
    });

    it("应该成功提取原生代币", async function () {
      const withdrawAmount = parseEther("0.5");
      const balanceBefore = await publicClient.getBalance({ address: treasury.account.address });

      const tx = await admin.writeContract({
        address: swapRouter.address,
        abi: swapRouter.abi,
        functionName: "withdrawNative",
        args: [treasury.account.address, withdrawAmount],
      });
      await waitForTx(tx);

      const balanceAfter = await publicClient.getBalance({ address: treasury.account.address });
      assert.equal(balanceAfter - balanceBefore, withdrawAmount);
    });

    it("应该拒绝没有 TREASURY_ROLE 的地址", async function () {
      await assert.rejects(
        async () =>
          user.writeContract({
            address: swapRouter.address,
            abi: swapRouter.abi,
            functionName: "withdrawNative",
            args: [user.account.address, parseEther("0.1")],
          })
      );
    });

    it("应该拒绝零地址接收", async function () {
      await assert.rejects(
        async () =>
          admin.writeContract({
            address: swapRouter.address,
            abi: swapRouter.abi,
            functionName: "withdrawNative",
            args: [zeroAddress, parseEther("0.1")],
          })
      );
    });

    it("应该拒绝零金额提取", async function () {
      await assert.rejects(
        async () =>
          admin.writeContract({
            address: swapRouter.address,
            abi: swapRouter.abi,
            functionName: "withdrawNative",
            args: [admin.account.address, 0n],
          })
      );
    });

    it("应该拒绝超出余额的提取", async function () {
      await assert.rejects(
        async () =>
          admin.writeContract({
            address: swapRouter.address,
            abi: swapRouter.abi,
            functionName: "withdrawNative",
            args: [admin.account.address, parseEther("999")],
          })
      );
    });
  });

  // ============ Treasury 与兑换交互 ============

  describe("Treasury 与兑换的交互", function () {
    it("提取后不影响后续兑换功能", async function () {
      await depositStablecoin("1000");
      let tx = await admin.writeContract({
        address: swapRouter.address,
        abi: swapRouter.abi,
        functionName: "withdrawStablecoin",
        args: [usdc.address, 0n, treasury.account.address],
      });
      await waitForTx(tx);

      const swapAmount = parseUnits("100", 6);
      tx = await user.writeContract({
        address: usdc.address,
        abi: usdc.abi,
        functionName: "approve",
        args: [swapRouter.address, swapAmount],
      });
      await waitForTx(tx);
      tx = await user.writeContract({
        address: swapRouter.address,
        abi: swapRouter.abi,
        functionName: "swap",
        args: [usdc.address, swapAmount, 0n, 0],
      });
      await waitForTx(tx);

      const sapBalance = await sapToken.read.balanceOf([user.account.address]);
      assert.ok(sapBalance > 0n);
    });
  });
});
