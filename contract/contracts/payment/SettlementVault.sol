// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title SettlementVault
/// @notice 订单支付资金托管金库；支持买家确认收货后放款给卖家，或退款给买家
contract SettlementVault is AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant ROUTER_ROLE = keccak256("ROUTER_ROLE");
    bytes32 public constant SETTLEMENT_OPERATOR_ROLE = keccak256("SETTLEMENT_OPERATOR_ROLE");

    /// @dev 订单状态枚举
    enum OrderStatus {
        None,       // 不存在
        Paid,       // 已付款，等待卖家发货
        Confirmed,  // 买家已确认收货
        Released,   // 已放款给卖家（终态）
        Refunded    // 已退款给买家（终态）
    }

    /// @dev 订单结构体
    struct Order {
        string intentId;
        string orderRef;
        address payer;          // 买家地址
        address seller;         // 卖家地址
        address token;          // 代币地址
        uint256 amount;         // 金额
        OrderStatus status;     // 订单状态
        uint256 paidAt;         // 付款时间
        uint256 confirmedAt;    // 买家确认时间
        uint256 releasedAt;     // 放款时间
        uint256 refundedAt;     // 退款时间
    }

    /// @dev intentId => Order
    mapping(bytes32 => Order) private _orders;

    event DepositRecorded(
        string indexed intentId,
        string indexed orderRef,
        address indexed payer,
        address seller,
        address token,
        uint256 amount
    );

    event OrderConfirmed(
        string indexed intentId,
        address indexed payer,
        uint256 timestamp
    );

    event FundsReleased(
        string indexed intentId,
        address indexed seller,
        address token,
        uint256 amount,
        uint256 timestamp
    );

    event FundsRefunded(
        string indexed intentId,
        address indexed payer,
        address token,
        uint256 amount,
        uint256 timestamp
    );

    error ZeroAddress();
    error ZeroAmount();
    error EmptyIntentId();
    error EmptyOrderRef();
    error OrderRefTooLong(uint256 length, uint256 maxLength);
    error OrderNotFound(bytes32 intentHash);
    error OrderAlreadyPaid(bytes32 intentHash);
    error InvalidOrderStatus(OrderStatus current, OrderStatus expected);
    error OnlyPayerCanConfirm();
    error TransferFailed();

    uint256 public constant MAX_ORDER_REF_LENGTH = 64;

    constructor(address admin) {
        if (admin == address(0)) revert ZeroAddress();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
        _grantRole(SETTLEMENT_OPERATOR_ROLE, admin);
    }

    /// @notice 由 PaymentRouter 在 transferFrom 完成后调用，记录订单并托管资金
    function depositFromRouter(
        string calldata intentId,
        string calldata orderRef,
        address payer,
        address seller,
        address token,
        uint256 amount
    ) external onlyRole(ROUTER_ROLE) whenNotPaused nonReentrant {
        _validateIntentAndOrderRef(intentId, orderRef);
        if (payer == address(0) || seller == address(0) || token == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();

        bytes32 intentHash = keccak256(bytes(intentId));
        if (_orders[intentHash].status != OrderStatus.None) revert OrderAlreadyPaid(intentHash);

        _orders[intentHash] = Order({
            intentId: intentId,
            orderRef: orderRef,
            payer: payer,
            seller: seller,
            token: token,
            amount: amount,
            status: OrderStatus.Paid,
            paidAt: block.timestamp,
            confirmedAt: 0,
            releasedAt: 0,
            refundedAt: 0
        });

        emit DepositRecorded(intentId, orderRef, payer, seller, token, amount);
    }

    /// @notice 买家确认收货；只有付款人可以调用
    function confirmOrder(string calldata intentId) external whenNotPaused nonReentrant {
        bytes32 intentHash = keccak256(bytes(intentId));
        Order storage order = _orders[intentHash];

        if (order.status == OrderStatus.None) revert OrderNotFound(intentHash);
        if (order.status != OrderStatus.Paid) revert InvalidOrderStatus(order.status, OrderStatus.Paid);
        if (order.payer != msg.sender) revert OnlyPayerCanConfirm();

        order.status = OrderStatus.Confirmed;
        order.confirmedAt = block.timestamp;

        emit OrderConfirmed(intentId, msg.sender, block.timestamp);
    }

    /// @notice 释放资金给卖家；需要 SETTLEMENT_OPERATOR_ROLE 角色
    /// @dev 只有状态为 Confirmed 的订单才能释放
    function release(string calldata intentId) external onlyRole(SETTLEMENT_OPERATOR_ROLE) whenNotPaused nonReentrant {
        bytes32 intentHash = keccak256(bytes(intentId));
        Order storage order = _orders[intentHash];

        if (order.status == OrderStatus.None) revert OrderNotFound(intentHash);
        if (order.status != OrderStatus.Confirmed) revert InvalidOrderStatus(order.status, OrderStatus.Confirmed);

        order.status = OrderStatus.Released;
        order.releasedAt = block.timestamp;

        IERC20(order.token).safeTransfer(order.seller, order.amount);

        emit FundsReleased(intentId, order.seller, order.token, order.amount, block.timestamp);
    }

    /// @notice 退款给买家；需要 SETTLEMENT_OPERATOR_ROLE 角色
    /// @dev 只有状态为 Paid 的订单才能退款（已确认的订单不能退款）
    function refund(string calldata intentId) external onlyRole(SETTLEMENT_OPERATOR_ROLE) whenNotPaused nonReentrant {
        bytes32 intentHash = keccak256(bytes(intentId));
        Order storage order = _orders[intentHash];

        if (order.status == OrderStatus.None) revert OrderNotFound(intentHash);
        if (order.status != OrderStatus.Paid) revert InvalidOrderStatus(order.status, OrderStatus.Paid);

        order.status = OrderStatus.Refunded;
        order.refundedAt = block.timestamp;

        IERC20(order.token).safeTransfer(order.payer, order.amount);

        emit FundsRefunded(intentId, order.payer, order.token, order.amount, block.timestamp);
    }

    /// @notice 查询订单信息
    function getOrder(string calldata intentId) external view returns (Order memory) {
        bytes32 intentHash = keccak256(bytes(intentId));
        return _orders[intentHash];
    }

    /// @notice 查询订单状态
    function getOrderStatus(string calldata intentId) external view returns (OrderStatus) {
        bytes32 intentHash = keccak256(bytes(intentId));
        return _orders[intentHash].status;
    }

    /// @notice 检查订单是否已付款
    function isOrderPaid(string calldata intentId) external view returns (bool) {
        bytes32 intentHash = keccak256(bytes(intentId));
        return _orders[intentHash].status != OrderStatus.None;
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
