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
/// @notice 订单 USDC 支付入口（UUPS）；幂等 intent、链上白名单 token/chainId、资金进入 SettlementVault
/// @dev 支付 token 与 chainId 由 PAYMENT_ADMIN 在 initialize 时写入；运营配置以 sys_chain_network 为准，链上仅做最小校验
contract PaymentRouter is Initializable, UUPSUpgradeable, AccessControlUpgradeable, PausableUpgradeable {
    using SafeERC20 for IERC20;

    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    uint256 public constant MAX_ORDER_REF_LENGTH = 64;

    SettlementVault public settlementVault;
    address public paymentToken;
    uint256 public expectedChainId;

    mapping(bytes32 => bool) private _paidIntents;

    event PaymentPaid(
        string indexed intentId,
        string indexed orderRef,
        address indexed payer,
        address token,
        uint256 amount,
        uint256 timestamp
    );
    event PaymentTokenUpdated(address oldToken, address newToken);
    event ExpectedChainIdUpdated(uint256 oldChainId, uint256 newChainId);

    error ZeroAddress();
    error EmptyIntentId();
    error EmptyOrderRef();
    error OrderRefTooLong(uint256 length, uint256 maxLength);
    error ZeroAmount();
    error IntentAlreadyPaid(string intentId);
    error TokenNotAllowed(address token);
    error UnexpectedChainId(uint256 actual, uint256 expected);
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
        address settlementVault_,
        address paymentToken_,
        uint256 expectedChainId_
    ) external initializer {
        if (admin == address(0) || settlementVault_ == address(0) || paymentToken_ == address(0)) {
            revert ZeroAddress();
        }
        if (expectedChainId_ == 0) revert UnexpectedChainId(block.chainid, 0);

        __AccessControl_init();
        __Pausable_init();
        _reentrancyStatus = _NOT_ENTERED;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);

        settlementVault = SettlementVault(settlementVault_);
        paymentToken = paymentToken_;
        expectedChainId = expectedChainId_;
    }

    function payOrder(
        string calldata intentId,
        string calldata orderRef,
        address token,
        uint256 amount
    ) external whenNotPaused nonReentrant {
        _validateIntentAndOrderRef(intentId, orderRef);
        if (amount == 0) revert ZeroAmount();

        bytes32 intentHash = keccak256(bytes(intentId));
        if (_paidIntents[intentHash]) revert IntentAlreadyPaid(intentId);
        if (token != paymentToken) revert TokenNotAllowed(token);
        if (block.chainid != expectedChainId) revert UnexpectedChainId(block.chainid, expectedChainId);

        _paidIntents[intentHash] = true;

        IERC20(token).safeTransferFrom(_msgSender(), address(settlementVault), amount);
        settlementVault.depositFromRouter(intentId, orderRef, _msgSender(), token, amount);

        emit PaymentPaid(intentId, orderRef, _msgSender(), token, amount, block.timestamp);
    }

    function setPaymentToken(address paymentToken_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (paymentToken_ == address(0)) revert ZeroAddress();
        emit PaymentTokenUpdated(paymentToken, paymentToken_);
        paymentToken = paymentToken_;
    }

    function setExpectedChainId(uint256 expectedChainId_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (expectedChainId_ == 0) revert UnexpectedChainId(block.chainid, 0);
        emit ExpectedChainIdUpdated(expectedChainId, expectedChainId_);
        expectedChainId = expectedChainId_;
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

    function _validateIntentAndOrderRef(string calldata intentId, string calldata orderRef) internal pure {
        if (bytes(intentId).length == 0) revert EmptyIntentId();
        if (bytes(orderRef).length == 0) revert EmptyOrderRef();
        if (bytes(orderRef).length > MAX_ORDER_REF_LENGTH) {
            revert OrderRefTooLong(bytes(orderRef).length, MAX_ORDER_REF_LENGTH);
        }
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {}

    uint256[45] private __gap;
}
