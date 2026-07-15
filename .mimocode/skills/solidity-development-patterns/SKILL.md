---
name: solidity-development-patterns
description: Common Solidity/Hardhat patterns and pitfalls for Sapphire Mall smart contracts.
---

# Solidity Development Patterns

## Event Indexed Limit

Maximum 3 `indexed` parameters per event.超过编译报错 `More than 3 indexed arguments for event`.

```solidity
// ✅ Correct (3 indexed max)
event PaymentPaid(
    bytes32 indexed intentId,
    address indexed buyer,
    uint256 amount
);

// ❌ Incorrect (4 indexed)
event PaymentPaid(
    bytes32 indexed intentId,
    address indexed buyer,
    address indexed seller,
    uint256 amount
);
```

## ReentrancyGuardUpgradeable Removed in OZ v5

`@openzeppelin/contracts-upgradeable@^5.6.1` no longer exports `utils/ReentrancyGuardUpgradeable.sol`.

**Solution**: Use custom reentrancy guard or non-upgradeable `ReentrancyGuard`.

```solidity
// Before (OZ v4)
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

// After (OZ v5)
// Option 1: Custom guard
modifier nonReentrant() {
    require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
    _status = _ENTERED;
    _;
    _status = _NOT_ENTERED;
}

// Option 2: Non-upgradeable
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
```

## View Functions Cannot Use `.call()`

Solidity forbids `.call()` in `view` functions. Use `.staticcall()`:

```solidity
// ❌ Incorrect
function getTokenBalance(address token) public view returns (uint256) {
    (bool success, bytes memory data) = token.call(
        abi.encodeWithSignature("balanceOf(address)", address(this))
    );
    // ...
}

// ✅ Correct
function getTokenBalance(address token) public view returns (uint256) {
    (bool success, bytes memory data) = token.staticcall(
        abi.encodeWithSignature("balanceOf(address)", address(this))
    );
    // ...
}
```

## OZ v5 `_disableInitializers()` Blocks Testing

Contracts with `_disableInitializers()` in constructor cannot call `initialize()` on implementation.

**Error**: `0xf92ee8a9` = `InvalidInitialization()`

**Solution for tests**: Use `hardhat_setStorageAt` RPC to reset initialized slot.

```typescript
// OZ v5 uses ERC-7201 namespaced storage
// Slot: 0xf0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00
await network.provider.send("hardhat_setStorageAt", [
  contractAddress,
  "0xf0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00",
  "0x0000000000000000000000000000000000000000000000000000000000000000",
]);
```

## Indexed String Events

`string indexed` params stored as `keccak256 hashes` — original string cannot be recovered.

```solidity
// Original string not in logs
event OrderCreated(string indexed intentId, address buyer);
// intentId in logs = keccak256("order-123")
```

**Solution**: Match against database records by comparing hashes.

## Solidity Event Best Practices

1. Use `indexed` for filtering (max 3)
2. Emit addresses as `indexed` for log filtering
3. Use `bytes32` for IDs instead of `string` (gas efficient)
4. Document event parameters in NatSpec

## Hardhat Node.js Version

- Hardhat 3.5+ requires Node.js 22.13+
- Node.js 22.10.0 stuck on Hardhat 3.4.0
- Workaround: Use `npx tsx --test` instead of toolbox

## Related Knowledge

- MEMORY.md lines 49, 74-78: Solidity and Hardhat patterns
- Contract directory: `contract/`
