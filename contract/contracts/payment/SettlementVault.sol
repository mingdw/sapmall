// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title SettlementVault
/// @notice 订单支付资金托管金库（Phase 1 不可升级）；仅 PaymentRouter 可记账入账
contract SettlementVault is AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant ROUTER_ROLE = keccak256("ROUTER_ROLE");
    bytes32 public constant SETTLEMENT_OPERATOR_ROLE = keccak256("SETTLEMENT_OPERATOR_ROLE");

    event DepositRecorded(
        string indexed intentId,
        string indexed orderRef,
        address indexed payer,
        address token,
        uint256 amount
    );

    error ZeroAddress();
    error ZeroAmount();
    error EmptyIntentId();
    error EmptyOrderRef();
    error OrderRefTooLong(uint256 length, uint256 maxLength);
    error SettlementNotEnabled();

    uint256 public constant MAX_ORDER_REF_LENGTH = 64;

    constructor(address admin) {
        if (admin == address(0)) revert ZeroAddress();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
        _grantRole(SETTLEMENT_OPERATOR_ROLE, admin);
    }

    /// @notice 由 PaymentRouter 在 transferFrom 完成后调用（Phase 1 仅记账，不发支付成功事实事件）
    function depositFromRouter(
        string calldata intentId,
        string calldata orderRef,
        address payer,
        address token,
        uint256 amount
    ) external onlyRole(ROUTER_ROLE) whenNotPaused nonReentrant {
        _validateIntentAndOrderRef(intentId, orderRef);
        if (payer == address(0) || token == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();

        emit DepositRecorded(intentId, orderRef, payer, token, amount);
    }

    /// @dev Phase 2+ 分账出口；Phase 1 保留签名并 revert
    function release(address to, address token, uint256 amount) external onlyRole(SETTLEMENT_OPERATOR_ROLE) {
        to;
        token;
        amount;
        revert SettlementNotEnabled();
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
}
