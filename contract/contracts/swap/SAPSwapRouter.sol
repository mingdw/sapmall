// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";

import {ISAPSwapRouter} from "./ISAPSwapRouter.sol";

/// @title SAPSwapRouter
/// @notice 稳定币兑换SAP代币的路由器（UUPS可升级）
/// @dev 支持多稳定币、固定汇率、手续费机制；通过SAPToken.mintForExchange铸造SAP
contract SAPSwapRouter is
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ISAPSwapRouter
{
    using SafeERC20 for IERC20;

    // ============ 角色定义 ============
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant CONFIG_ROLE = keccak256("CONFIG_ROLE");
    bytes32 public constant TREASURY_ROLE = keccak256("TREASURY_ROLE");

    // ============ 常量 ============
    /// @dev 基点分母，10000 = 100%
    uint256 private constant BPS_DENOMINATOR = 10_000;
    /// @dev 最大手续费：5%（500基点）
    uint256 private constant MAX_FEE_BPS = 500;
    /// @dev 最小兑换金额
    uint256 public constant MIN_SWAP_AMOUNT = 1e6; // 1 USDC (6 decimals)

    // ============ 状态变量 ============
    /// @notice SAP代币合约地址
    address public sapToken;

    /// @notice 手续费接收地址
    address public feeRecipient;

    /// @notice 手续费（基点，如100 = 1%）
    uint256 public feeBps;

    /// @notice 稳定币配置
    struct StablecoinConfig {
        uint8 decimals;
        string symbol;
        uint256 rateToSAP; // 汇率：1单位稳定币 = X单位SAP（考虑精度后）
        bool isActive;
    }

    mapping(address => StablecoinConfig) public stablecoinConfigs;
    address[] public supportedStablecoins;

    /// @notice 兑换统计
    uint256 public totalSAPMinted;
    uint256 public totalStablecoinReceived;
    uint256 public totalFeesCollected;

    /// @notice 累计提取金额（按代币地址）
    mapping(address => uint256) public totalWithdrawn;

    // ============ 重入保护 ============
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _reentrancyStatus;

    // ============ 错误定义 ============
    error ZeroAddress();
    error ZeroAmount();
    error AmountBelowMinimum();
    error TokenNotSupported();
    error TokenAlreadySupported();
    error InvalidRate();
    error InvalidFee();
    error SlippageExceeded();
    error SwapFailed();
    error InsufficientBalance();
    error ReentrancyGuardReentrantCall();

    // ============ 事件 ============
    event SwapExecuted(
        address indexed user,
        SwapDirection direction,
        address tokenIn,
        uint256 amountIn,
        uint256 amountOut,
        uint256 fee,
        uint256 timestamp
    );

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    modifier nonReentrant() {
        if (_reentrancyStatus == _ENTERED) revert ReentrancyGuardReentrantCall();
        _reentrancyStatus = _ENTERED;
        _;
        _reentrancyStatus = _NOT_ENTERED;
    }

    // ============ 初始化 ============
    function initialize(
        address admin,
        address sapToken_,
        address feeRecipient_,
        uint256 feeBps_
    ) external initializer {
        if (admin == address(0) || sapToken_ == address(0) || feeRecipient_ == address(0)) {
            revert ZeroAddress();
        }
        if (feeBps_ > MAX_FEE_BPS) revert InvalidFee();

        __AccessControl_init();
        __Pausable_init();
        _reentrancyStatus = _NOT_ENTERED;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
        _grantRole(CONFIG_ROLE, admin);
        _grantRole(TREASURY_ROLE, admin);

        sapToken = sapToken_;
        feeRecipient = feeRecipient_;
        feeBps = feeBps_;
    }

    // ============ 兑换功能 ============
    /// @notice 将稳定币兑换为SAP
    /// @param tokenIn 稳定币地址
    /// @param amountIn 输入金额
    /// @param minAmountOut 最小输出金额（滑点保护）
    /// @return amountOut 实际输出SAP数量

    /// @notice 带 EIP-2612 Permit 的兑换（减少单独 approve 签名）
    /// @dev 若 tokenIn 不支持 permit，调用将 revert，前端应回退到 approve+swap
    function swapWithPermit(
        address tokenIn,
        uint256 amountIn,
        uint256 minAmountOut,
        SwapDirection direction,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external whenNotPaused nonReentrant returns (uint256 amountOut) {
        if (amountIn == 0) revert ZeroAmount();
        if (amountIn < MIN_SWAP_AMOUNT) revert AmountBelowMinimum();
        if (direction != SwapDirection.STABLE_TO_SAP) {
            revert("SAP_TO_STABLE not supported yet");
        }

        IERC20Permit(tokenIn).permit(msg.sender, address(this), amountIn, deadline, v, r, s);
        amountOut = _swapStableToSAP(tokenIn, amountIn, minAmountOut);

        emit SwapExecuted(
            msg.sender,
            direction,
            tokenIn,
            amountIn,
            amountOut,
            _calculateFee(amountIn),
            block.timestamp
        );
    }

    function swap(
        address tokenIn,
        uint256 amountIn,
        uint256 minAmountOut,
        SwapDirection direction
    ) external whenNotPaused nonReentrant returns (uint256 amountOut) {
        if (amountIn == 0) revert ZeroAmount();
        if (amountIn < MIN_SWAP_AMOUNT) revert AmountBelowMinimum();

        if (direction == SwapDirection.STABLE_TO_SAP) {
            amountOut = _swapStableToSAP(tokenIn, amountIn, minAmountOut);
        } else {
            revert("SAP_TO_STABLE not supported yet");
        }

        emit SwapExecuted(
            msg.sender,
            direction,
            tokenIn,
            amountIn,
            amountOut,
            _calculateFee(amountOut),
            block.timestamp
        );
    }

    /// @notice 内部：稳定币 → SAP
    function _swapStableToSAP(
        address tokenIn,
        uint256 amountIn,
        uint256 minAmountOut
    ) internal returns (uint256 amountOut) {
        StablecoinConfig memory config = stablecoinConfigs[tokenIn];
        if (!config.isActive) revert TokenNotSupported();

        // 1. 计算手续费
        uint256 fee = _calculateFee(amountIn);
        uint256 amountAfterFee = amountIn - fee;

        // 2. 计算输出SAP数量
        // 公式：amountOut = amountAfterFee * rateToSAP / 10^decimals
        amountOut = (amountAfterFee * config.rateToSAP) / (10 ** config.decimals);

        // 3. 检查滑点
        if (amountOut < minAmountOut) revert SlippageExceeded();

        // 4. 从用户转移稳定币
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);

        // 5. 转移手续费到手续费地址
        if (fee > 0) {
            IERC20(tokenIn).safeTransfer(feeRecipient, fee);
        }

        // 6. 铸造SAP给用户
        _mintSAP(msg.sender, amountOut);

        // 7. 更新统计
        totalSAPMinted += amountOut;
        totalStablecoinReceived += amountAfterFee;
        totalFeesCollected += fee;
    }

    /// @notice 内部：铸造SAP（调用SAPToken.mintForExchange）
    function _mintSAP(address to, uint256 amount) internal {
        // 调用SAPToken的mintForExchange
        (bool success, bytes memory data) = sapToken.call(
            abi.encodeWithSignature("mintForExchange(address,uint256)", to, amount)
        );

        if (!success) {
            // 解析错误信息
            if (data.length > 0) {
                assembly {
                    revert(add(data, 32), mload(data))
                }
            }
            revert SwapFailed();
        }
    }

    // ============ 报价功能 ============
    /// @notice 查询兑换报价
    /// @param tokenIn 稳定币地址
    /// @param amountIn 输入金额
    /// @return amountOut 预期输出金额
    /// @return fee 手续费
    function quoteSwap(
        address tokenIn,
        uint256 amountIn,
        SwapDirection direction
    ) external view returns (uint256 amountOut, uint256 fee) {
        if (direction != SwapDirection.STABLE_TO_SAP) {
            revert("Only STABLE_TO_SAP supported");
        }

        StablecoinConfig memory config = stablecoinConfigs[tokenIn];
        if (!config.isActive) revert TokenNotSupported();

        fee = _calculateFee(amountIn);
        uint256 amountAfterFee = amountIn - fee;
        amountOut = (amountAfterFee * config.rateToSAP) / (10 ** config.decimals);
    }

    // ============ 配置管理 ============
    /// @notice 添加支持的稳定币
    function addStablecoin(
        address token,
        uint8 decimals,
        string calldata symbol,
        uint256 rateToSAP
    ) external onlyRole(CONFIG_ROLE) {
        if (token == address(0)) revert ZeroAddress();
        if (stablecoinConfigs[token].isActive) revert TokenAlreadySupported();
        if (rateToSAP == 0) revert InvalidRate();

        stablecoinConfigs[token] = StablecoinConfig({
            decimals: decimals,
            symbol: symbol,
            rateToSAP: rateToSAP,
            isActive: true
        });

        supportedStablecoins.push(token);
        emit StablecoinAdded(token, decimals, symbol);
    }

    /// @notice 移除支持的稳定币
    function removeStablecoin(address token) external onlyRole(CONFIG_ROLE) {
        if (!stablecoinConfigs[token].isActive) revert TokenNotSupported();

        stablecoinConfigs[token].isActive = false;

        // 从数组中移除
        uint256 len = supportedStablecoins.length;
        for (uint256 i = 0; i < len; i++) {
            if (supportedStablecoins[i] == token) {
                supportedStablecoins[i] = supportedStablecoins[len - 1];
                supportedStablecoins.pop();
                break;
            }
        }

        emit StablecoinRemoved(token);
    }

    /// @notice 更新汇率
    function updateRate(address token, uint256 newRate) external onlyRole(CONFIG_ROLE) {
        if (!stablecoinConfigs[token].isActive) revert TokenNotSupported();
        if (newRate == 0) revert InvalidRate();

        stablecoinConfigs[token].rateToSAP = newRate;
        emit RateUpdated(token, newRate);
    }

    /// @notice 更新手续费
    function updateFee(uint256 newFeeBps) external onlyRole(CONFIG_ROLE) {
        if (newFeeBps > MAX_FEE_BPS) revert InvalidFee();

        feeBps = newFeeBps;
        emit FeeUpdated(newFeeBps);
    }

    /// @notice 更新手续费接收地址
    function updateFeeRecipient(address newRecipient) external onlyRole(CONFIG_ROLE) {
        if (newRecipient == address(0)) revert ZeroAddress();
        feeRecipient = newRecipient;
    }

    /// @notice 更新SAP代币地址
    function updateSAPToken(address newSAPToken) external onlyRole(CONFIG_ROLE) {
        if (newSAPToken == address(0)) revert ZeroAddress();
        sapToken = newSAPToken;
    }

    // ============ 查询功能 ============
    /// @notice 检查代币是否支持
    function isStablecoinSupported(address token) external view returns (bool) {
        return stablecoinConfigs[token].isActive;
    }

    /// @notice 获取代币配置
    function getStablecoinConfig(address token) external view returns (
        uint8 decimals,
        string memory symbol,
        uint256 rateToSAP,
        bool isActive
    ) {
        StablecoinConfig memory config = stablecoinConfigs[token];
        return (config.decimals, config.symbol, config.rateToSAP, config.isActive);
    }

    /// @notice 获取所有支持的稳定币列表
    function getSupportedStablecoins() external view returns (address[] memory) {
        return supportedStablecoins;
    }

    /// @notice 获取兑换统计
    function getSwapStats() external view returns (
        uint256 _totalSAPMinted,
        uint256 _totalStablecoinReceived,
        uint256 _totalFeesCollected
    ) {
        return (totalSAPMinted, totalStablecoinReceived, totalFeesCollected);
    }

    /// @notice 获取SAP兑换剩余额度
    function getSAPExchangeRemaining() external view returns (uint256) {
        (bool success, bytes memory data) = sapToken.staticcall(
            abi.encodeWithSignature("getExchangeRemaining()")
        );
        if (success && data.length >= 32) {
            return abi.decode(data, (uint256));
        }
        return 0;
    }

    // ============ 资金提取（Treasury） ============
    /// @notice 提取合约中的稳定币到指定地址
    /// @param token 稳定币地址
    /// @param amount 提取金额（传 0 表示提取全部余额）
    /// @param to 接收地址
    function withdrawStablecoin(
        address token,
        uint256 amount,
        address to
    ) external onlyRole(TREASURY_ROLE) nonReentrant {
        if (to == address(0)) revert ZeroAddress();

        uint256 balance = IERC20(token).balanceOf(address(this));
        uint256 withdrawAmount = amount == 0 ? balance : amount;
        if (withdrawAmount == 0) revert ZeroAmount();
        if (withdrawAmount > balance) revert InsufficientBalance();

        totalWithdrawn[token] += withdrawAmount;
        IERC20(token).safeTransfer(to, withdrawAmount);

        emit FundsWithdrawn(token, to, withdrawAmount, block.timestamp);
    }

    /// @notice 提取合约中误转入的原生代币（ETH/BNB等）
    /// @param to 接收地址
    /// @param amount 提取金额
    function withdrawNative(
        address to,
        uint256 amount
    ) external onlyRole(TREASURY_ROLE) nonReentrant {
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        if (amount > address(this).balance) revert InsufficientBalance();

        (bool success, ) = to.call{value: amount}("");
        require(success, "Native transfer failed");

        emit NativeFundsWithdrawn(to, amount, block.timestamp);
    }

    /// @notice 查询合约中某稳定币的余额
    /// @param token 稳定币地址
    /// @return 余额
    function getStablecoinBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    // ============ 内部函数 ============
    function _calculateFee(uint256 amount) internal view returns (uint256) {
        return (amount * feeBps) / BPS_DENOMINATOR;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {}

    // ============ 接收原生代币 ============
    receive() external payable {}

    // ============ 暂停功能 ============
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    uint256[39] private __gap;
}
