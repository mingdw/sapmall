// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IPlatformConfig} from "./interfaces/IPlatformConfig.sol";
import {SettlementVault} from "./SettlementVault.sol";

/// @title PaymentRouter
/// @notice 订单 USDC 支付入口（UUPS）；幂等 intent、读 PlatformConfig、资金进入 SettlementVault
contract PaymentRouter is
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable
{
    using SafeERC20 for IERC20;

    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    /// @dev PlatformConfig 中 USDC 合约地址（valueType=address，每链部署一套 Config）
    string public constant CFG_PAYMENT_TOKEN_USDC = "payment.token.usdc";
    /// @dev PlatformConfig 中期望 chainId（valueType=number）
    string public constant CFG_PAYMENT_CHAIN_ID = "payment.chain.id";

    uint8 private constant CONFIG_STATUS_ENABLED = 0;
    uint256 public constant MAX_ORDER_REF_LENGTH = 64;

    IPlatformConfig public platformConfig;
    SettlementVault public settlementVault;

    mapping(bytes32 => bool) private _paidIntents;

    /// @dev EVM 仅支持 3 个 indexed topic；token/amount/timestamp 在 data 中由监听 ABI 解码
    event PaymentPaid(
        string indexed intentId,
        string indexed orderRef,
        address indexed payer,
        address token,
        uint256 amount,
        uint256 timestamp
    );

    error ZeroAddress();
    error EmptyIntentId();
    error EmptyOrderRef();
    error OrderRefTooLong(uint256 length, uint256 maxLength);
    error ZeroAmount();
    error IntentAlreadyPaid(string intentId);
    error TokenNotAllowed(address token);
    error UnexpectedChainId(uint256 actual, uint256 expected);
    error ConfigNotFound(string key);
    error ConfigDisabled(string key);
    error InvalidConfigValueType(string key, string valueType);
    error InvalidConfigAddress(string value);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address admin, address platformConfig_, address settlementVault_) external initializer {
        if (admin == address(0) || platformConfig_ == address(0) || settlementVault_ == address(0)) {
            revert ZeroAddress();
        }

        __AccessControl_init();
        __Pausable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);

        platformConfig = IPlatformConfig(platformConfig_);
        settlementVault = SettlementVault(settlementVault_);
    }

    /// @notice 订单支付：USDC 转入 SettlementVault 并发出 PaymentPaid
    function payOrder(
        string calldata intentId,
        string calldata orderRef,
        address token,
        uint256 amount
    ) external whenNotPaused {
        _validateIntentAndOrderRef(intentId, orderRef);
        if (amount == 0) revert ZeroAmount();

        bytes32 intentHash = keccak256(bytes(intentId));
        if (_paidIntents[intentHash]) revert IntentAlreadyPaid(intentId);

        address usdc = _resolveUsdcFromConfig();
        if (token != usdc) revert TokenNotAllowed(token);

        _validateChainIdFromConfig();

        _paidIntents[intentHash] = true;

        IERC20(token).safeTransferFrom(_msgSender(), address(settlementVault), amount);

        settlementVault.depositFromRouter(intentId, orderRef, _msgSender(), token, amount);

        emit PaymentPaid(intentId, orderRef, _msgSender(), token, amount, block.timestamp);
    }

    function setPlatformConfig(address platformConfig_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (platformConfig_ == address(0)) revert ZeroAddress();
        platformConfig = IPlatformConfig(platformConfig_);
    }

    function setSettlementVault(address settlementVault_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (settlementVault_ == address(0)) revert ZeroAddress();
        settlementVault = SettlementVault(settlementVault_);
    }

    function isIntentPaid(string calldata intentId) external view returns (bool) {
        return _paidIntents[keccak256(bytes(intentId))];
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _resolveUsdcFromConfig() internal view returns (address usdc) {
        IPlatformConfig.ConfigItem memory item = platformConfig.getConfig(CFG_PAYMENT_TOKEN_USDC);
        if (bytes(item.key).length == 0) revert ConfigNotFound(CFG_PAYMENT_TOKEN_USDC);
        if (item.status != CONFIG_STATUS_ENABLED) revert ConfigDisabled(CFG_PAYMENT_TOKEN_USDC);
        if (keccak256(bytes(item.valueType)) != keccak256("address")) {
            revert InvalidConfigValueType(CFG_PAYMENT_TOKEN_USDC, item.valueType);
        }
        return _parseAddress(item.value);
    }

    function _validateChainIdFromConfig() internal view {
        uint256 expected = platformConfig.getConfigUintValue(CFG_PAYMENT_CHAIN_ID);
        if (block.chainid != expected) revert UnexpectedChainId(block.chainid, expected);
    }

    function _validateIntentAndOrderRef(string calldata intentId, string calldata orderRef) internal pure {
        if (bytes(intentId).length == 0) revert EmptyIntentId();
        if (bytes(orderRef).length == 0) revert EmptyOrderRef();
        if (bytes(orderRef).length > MAX_ORDER_REF_LENGTH) {
            revert OrderRefTooLong(bytes(orderRef).length, MAX_ORDER_REF_LENGTH);
        }
    }

    function _parseAddress(string memory value) internal pure returns (address addr) {
        bytes memory b = bytes(value);
        if (b.length != 42) revert InvalidConfigAddress(value);
        if (b[0] != "0" || (b[1] != "x" && b[1] != "X")) revert InvalidConfigAddress(value);

        uint160 result = 0;
        for (uint256 i = 2; i < 42; ++i) {
            result <<= 4;
            uint8 c = uint8(b[i]);
            if (c >= 48 && c <= 57) {
                result |= uint160(c - 48);
            } else if (c >= 65 && c <= 70) {
                result |= uint160(c - 55);
            } else if (c >= 97 && c <= 102) {
                result |= uint160(c - 87);
            } else {
                revert InvalidConfigAddress(value);
            }
        }
        return address(result);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {}

    uint256[47] private __gap;
}
