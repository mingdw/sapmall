// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {SettlementVault} from "./SettlementVault.sol";

/// @title PaymentRouter
/// @notice 订单多币种稳定币支付入口（UUPS）；幂等 intent、链上白名单 token、资金进入 SettlementVault
/// @dev 支付 token 由 PAYMENT_ADMIN 通过白名单管理；运营配置以 sys_chain_network 为准，链上仅做最小校验
contract PaymentRouter is Initializable, UUPSUpgradeable, AccessControlUpgradeable, PausableUpgradeable {
    using SafeERC20 for IERC20;

    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    uint256 public constant MAX_ORDER_REF_LENGTH = 64;

    struct TokenConfig {
        address tokenAddress;
        uint8 decimals;
        bool isActive;
        string symbol;
    }

    SettlementVault public settlementVault;

    mapping(bytes32 => bool) private _paidIntents;
    mapping(uint256 => mapping(address => TokenConfig)) public supportedTokens;

    event PaymentPaid(
        string indexed intentId,
        string indexed orderRef,
        address indexed payer,
        address token,
        uint256 amount,
        uint256 timestamp
    );
    event TokenAdded(uint256 indexed chainId, address indexed token, uint8 decimals, string symbol);
    event TokenRemoved(uint256 indexed chainId, address indexed token);
    event TokenStatusChanged(uint256 indexed chainId, address indexed token, bool isActive);

    error ZeroAddress();
    error EmptyIntentId();
    error EmptyOrderRef();
    error OrderRefTooLong(uint256 length, uint256 maxLength);
    error ZeroAmount();
    error IntentAlreadyPaid(string intentId);
    error TokenNotSupported(address token);
    error TokenAlreadySupported(address token);
    error CannotRemoveActiveToken(address token);
    error EmptySymbol();
    error ReentrancyGuardReentrantCall();

    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _reentrancyStatus;

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

    function initialize(
        address admin,
        address settlementVault_
    ) external initializer {
        if (admin == address(0) || settlementVault_ == address(0)) {
            revert ZeroAddress();
        }

        __AccessControl_init();
        __Pausable_init();
        _reentrancyStatus = _NOT_ENTERED;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);

        settlementVault = SettlementVault(settlementVault_);
    }

    function payOrder(
        string calldata intentId,
        string calldata orderRef,
        address token,
        uint256 amount
    ) external whenNotPaused nonReentrant {
        _validateIntentAndOrderRef(intentId, orderRef);
        if (amount == 0) revert ZeroAmount();

        if (!supportedTokens[block.chainid][token].isActive) {
            revert TokenNotSupported(token);
        }

        bytes32 intentHash = keccak256(bytes(intentId));
        if (_paidIntents[intentHash]) revert IntentAlreadyPaid(intentId);

        _paidIntents[intentHash] = true;

        IERC20(token).safeTransferFrom(_msgSender(), address(settlementVault), amount);
        settlementVault.depositFromRouter(intentId, orderRef, _msgSender(), token, amount);

        emit PaymentPaid(intentId, orderRef, _msgSender(), token, amount, block.timestamp);
    }

    function setSettlementVault(address settlementVault_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (settlementVault_ == address(0)) revert ZeroAddress();
        settlementVault = SettlementVault(settlementVault_);
    }

    function addToken(
        uint256 chainId,
        address token,
        uint8 decimals,
        string calldata symbol
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (token == address(0)) revert ZeroAddress();
        if (bytes(symbol).length == 0) revert EmptySymbol();
        if (supportedTokens[chainId][token].isActive) revert TokenAlreadySupported(token);

        supportedTokens[chainId][token] = TokenConfig({
            tokenAddress: token,
            decimals: decimals,
            isActive: true,
            symbol: symbol
        });

        emit TokenAdded(chainId, token, decimals, symbol);
    }

    function removeToken(uint256 chainId, address token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (!supportedTokens[chainId][token].isActive) revert TokenNotSupported(token);

        delete supportedTokens[chainId][token];
        emit TokenRemoved(chainId, token);
    }

    function setTokenStatus(
        uint256 chainId,
        address token,
        bool isActive
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (supportedTokens[chainId][token].tokenAddress == address(0)) {
            revert TokenNotSupported(token);
        }
        supportedTokens[chainId][token].isActive = isActive;
        emit TokenStatusChanged(chainId, token, isActive);
    }

    function isTokenSupported(uint256 chainId, address token) external view returns (bool) {
        return supportedTokens[chainId][token].isActive;
    }

    function getTokenConfig(uint256 chainId, address token) external view returns (TokenConfig memory) {
        return supportedTokens[chainId][token];
    }

    function migrateInitialTokens(
        address[] calldata tokens,
        uint8[] calldata decimals,
        string[] calldata symbols
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(tokens.length == decimals.length, "Length mismatch");
        require(tokens.length == symbols.length, "Length mismatch");

        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == address(0)) revert ZeroAddress();
            if (bytes(symbols[i]).length == 0) revert EmptySymbol();

            supportedTokens[block.chainid][tokens[i]] = TokenConfig({
                tokenAddress: tokens[i],
                decimals: decimals[i],
                isActive: true,
                symbol: symbols[i]
            });
            emit TokenAdded(block.chainid, tokens[i], decimals[i], symbols[i]);
        }
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

    function _validateIntentAndOrderRef(string calldata intentId, string calldata orderRef) internal pure {
        if (bytes(intentId).length == 0) revert EmptyIntentId();
        if (bytes(orderRef).length == 0) revert EmptyOrderRef();
        if (bytes(orderRef).length > MAX_ORDER_REF_LENGTH) {
            revert OrderRefTooLong(bytes(orderRef).length, MAX_ORDER_REF_LENGTH);
        }
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {}

    uint256[44] private __gap;
}
