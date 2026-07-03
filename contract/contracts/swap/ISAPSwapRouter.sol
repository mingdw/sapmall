// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title ISAPSwapRouter
/// @notice SAP兑换路由器接口
interface ISAPSwapRouter {
    /// @notice 兑换方向
    enum SwapDirection {
        STABLE_TO_SAP,  // 稳定币 → SAP
        SAP_TO_STABLE   // SAP → 稳定币
    }

    /// @notice 兑换事件
    event Swap(
        address indexed user,
        SwapDirection direction,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 fee,
        uint256 timestamp
    );

    /// @notice 添加支持的稳定币
    event StablecoinAdded(address indexed token, uint8 decimals, string symbol);

    /// @notice 移除支持的稳定币
    event StablecoinRemoved(address indexed token);

    /// @notice 更新汇率
    event RateUpdated(address indexed token, uint256 newRate);

    /// @notice 更新手续费
    event FeeUpdated(uint256 newFeeBps);

    /// @notice 资金提取事件
    event FundsWithdrawn(
        address indexed token,
        address indexed to,
        uint256 amount,
        uint256 timestamp
    );

    /// @notice 原生币提取事件
    event NativeFundsWithdrawn(
        address indexed to,
        uint256 amount,
        uint256 timestamp
    );

    /// @notice 执行兑换
    /// @param tokenIn 输入代币地址
    /// @param amountIn 输入金额
    /// @param minAmountOut 最小输出金额（滑点保护）
    /// @param direction 兑换方向
    /// @return amountOut 实际输出金额
    function swap(
        address tokenIn,
        uint256 amountIn,
        uint256 minAmountOut,
        SwapDirection direction
    ) external returns (uint256 amountOut);

    /// @notice 查询兑换报价
    /// @param tokenIn 输入代币地址
    /// @param amountIn 输入金额
    /// @param direction 兑换方向
    /// @return amountOut 预期输出金额
    /// @return fee 手续费
    function quoteSwap(
        address tokenIn,
        uint256 amountIn,
        SwapDirection direction
    ) external view returns (uint256 amountOut, uint256 fee);

    /// @notice 添加支持的稳定币
    function addStablecoin(
        address token,
        uint8 decimals,
        string calldata symbol,
        uint256 rateToSAP
    ) external;

    /// @notice 移除支持的稳定币
    function removeStablecoin(address token) external;

    /// @notice 更新稳定币对SAP的汇率
    function updateRate(address token, uint256 newRate) external;

    /// @notice 更新手续费（基点）
    function updateFee(uint256 newFeeBps) external;

    /// @notice 检查代币是否支持
    function isStablecoinSupported(address token) external view returns (bool);

    /// @notice 获取代币配置
    function getStablecoinConfig(address token) external view returns (
        uint8 decimals,
        string memory symbol,
        uint256 rateToSAP,
        bool isActive
    );

    /// @notice 获取兑换统计
    function getSwapStats() external view returns (
        uint256 totalSAPMinted,
        uint256 totalStablecoinReceived,
        uint256 totalFeesCollected
    );

    /// @notice 提取合约中的稳定币到指定地址
    /// @param token 稳定币地址
    /// @param amount 提取金额（传 0 表示提取全部余额）
    /// @param to 接收地址
    function withdrawStablecoin(address token, uint256 amount, address to) external;

    /// @notice 提取合约中误转入的原生代币（ETH/BNB等）
    /// @param to 接收地址
    /// @param amount 提取金额
    function withdrawNative(address to, uint256 amount) external;

    /// @notice 查询合约中某稳定币的余额
    /// @param token 稳定币地址
    /// @return 余额
    function getStablecoinBalance(address token) external view returns (uint256);
}
