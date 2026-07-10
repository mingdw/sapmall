import { network } from "hardhat";

/**
 * 配置 SAPSwapRouter：添加支持的稳定币 + 设置汇率
 *
 * 运行方式：
 *   npx hardhat run scripts/configure-swap-router.ts --network arcTestnet
 *
 * 环境变量（可选，有默认值）：
 *   SWAP_ROUTER_ADDRESS  — SAPSwapRouter 代理合约地址
 *   SAP_TOKEN_ADDRESS    — SAPToken 代理合约地址（用于验证 EXCHANGE_ROLE）
 *
 * rateToSAP 说明：
 *   合约公式：amountOut = (amountAfterFee * rateToSAP) / (10^decimals)
 *   即 1 个最小单位的稳定币 = rateToSAP 个最小单位的 SAP
 *
 *   例：USDC 6 位精度，SAP 18 位精度，设 1 USDC = 2 SAP
 *     rateToSAP = 2 * 10^18 / 10^6 * 10^6 = 2 * 10^18
 *     即 rateToSAP = targetSAPPerToken * 10^sapDecimals
 *     （因为 amountIn 已经是 10^decimals 为单位，除以 10^decimals 后再乘 rateToSAP）
 *
 *   简化：rateToSAP = SAP数量_per_1_token * 10^(sapDecimals)
 *         其中 SAP数量_per_1_token 是 1 个完整代币兑换多少个完整 SAP
 */
async function main() {
  const { viem } = await network.create();
  const [deployer] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  console.log("Configuring with account:", deployer.account.address);

  // ── 合约地址 ──
  const SWAP_ROUTER_ADDRESS = (
    process.env.SWAP_ROUTER_ADDRESS ??
    "0x754a5a7e0534a94fdbfacc5f5434db3585643ddf"
  ) as `0x${string}`;

  console.log("SAPSwapRouter:", SWAP_ROUTER_ADDRESS);

  const swapRouter = await viem.getContractAt("SAPSwapRouter", SWAP_ROUTER_ADDRESS);

  // ── 验证合约可访问 ──
  const feeBps = await swapRouter.read.feeBps();
  console.log("Current feeBps:", feeBps.toString());

  const supportedBefore = await swapRouter.read.getSupportedStablecoins();
  console.log("Supported stablecoins before:", supportedBefore);

  // ── 稳定币配置 ──
  // Arc Testnet 上的代币地址（与数据库 sys_chain_payment_token 一致）
  const STABLECOINS = [
    {
      symbol: "USDC",
      address: "0x3600000000000000000000000000000000000000",
      decimals: 6,
      // 1 USDC = 2.85 SAP（示例汇率，按需修改）
      // rateToSAP = 2.85 * 10^18 = 2850000000000000000
      rateToSAP: BigInt("2850000000000000000"),
    },
    {
      symbol: "EURC",
      address: "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a",
      decimals: 6,
      // 1 EURC = 3.10 SAP
      rateToSAP: BigInt("3100000000000000000"),
    },
    {
      symbol: "cirBTC",
      address: "0xf0C4a4CE82A5746AbAAd9425360Ab04fbBA432BF",
      decimals: 8,
      // 1 cirBTC = 350000 SAP
      rateToSAP: BigInt("350000000000000000000000"),
    },
  ];

  // ── 逐个添加稳定币 ──
  for (const coin of STABLECOINS) {
    // 先检查是否已添加
    const isSupported = await swapRouter.read.isStablecoinSupported([coin.address]);
    if (isSupported) {
      console.log(`\n[${coin.symbol}] Already supported, updating rate...`);
      const updateTx = await deployer.writeContract({
        address: SWAP_ROUTER_ADDRESS,
        abi: swapRouter.abi,
        functionName: "updateRate",
        args: [coin.address, coin.rateToSAP],
      });
      await publicClient.waitForTransactionReceipt({ hash: updateTx });
      console.log(`[${coin.symbol}] Rate updated to ${coin.rateToSAP}`);
    } else {
      console.log(`\n[${coin.symbol}] Adding stablecoin...`);
      console.log(`  Address:  ${coin.address}`);
      console.log(`  Decimals: ${coin.decimals}`);
      console.log(`  RateToSAP: ${coin.rateToSAP}`);

      const addTx = await deployer.writeContract({
        address: SWAP_ROUTER_ADDRESS,
        abi: swapRouter.abi,
        functionName: "addStablecoin",
        args: [coin.address, coin.decimals, coin.symbol, coin.rateToSAP],
      });
      await publicClient.waitForTransactionReceipt({ hash: addTx });
      console.log(`[${coin.symbol}] Added successfully`);
    }

    // 验证配置
    const config = await swapRouter.read.getStablecoinConfig([coin.address]);
    console.log(`  Verified: decimals=${config[0]}, symbol="${config[1]}", rateToSAP=${config[2]}, isActive=${config[3]}`);
  }

  // ── 验证报价功能 ──
  console.log("\n=== Testing quoteSwap ===");
  const testAmount = BigInt("1000000"); // 1 USDC (6 decimals)
  try {
    const [amountOut, fee] = await swapRouter.read.quoteSwap([
      STABLECOINS[0].address,
      testAmount,
      0, // SwapDirection.STABLE_TO_SAP
    ]);
    console.log(`quoteSwap(1 USDC):`);
    console.log(`  amountOut: ${amountOut.toString()} (${(Number(amountOut) / 1e18).toFixed(6)} SAP)`);
    console.log(`  fee:       ${fee.toString()} (${(Number(fee) / 1e6).toFixed(6)} USDC)`);
  } catch (err) {
    console.error("quoteSwap failed:", err);
  }

  // ── 最终状态 ──
  const supportedAfter = await swapRouter.read.getSupportedStablecoins();
  console.log("\n=== Configuration Complete ===");
  console.log("Supported stablecoins after:", supportedAfter);

  const stats = await swapRouter.read.getSwapStats();
  console.log("SwapStats:");
  console.log(`  totalSAPMinted:          ${stats[0].toString()}`);
  console.log(`  totalStablecoinReceived: ${stats[1].toString()}`);
  console.log(`  totalFeesCollected:      ${stats[2].toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
