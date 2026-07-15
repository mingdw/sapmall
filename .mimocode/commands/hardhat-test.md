---
name: hardhat-test
description: Run Hardhat tests with correct configuration for Node.js version constraints.
---

# Hardhat Test

## Node.js Version Requirements

- Hardhat 3.5+ requires Node.js 22.13+
- Node.js 22.10.0 stuck on Hardhat 3.4.0

## Test Commands

### Standard Test
```bash
npx hardhat test
```

### If toolbox crashes (TypeError: Cannot read properties of undefined)
```bash
npx tsx --test test/*.ts
```

This bypasses `@nomicfoundation/hardhat-node-test-reporter` bug.

### Run Specific Test
```bash
npx hardhat test test/payment-router.test.ts
```

### With Gas Reporting
```bash
REPORT_GAS=true npx hardhat test
```

## Common Issues

### Error: "Cannot read properties of undefined (reading 'toString')"
**Cause**: `@nomicfoundation/hardhat-node-test-reporter` bug
**Fix**: Use `npx tsx --test` instead

### Error: "Hardhat version incompatible"
**Cause**: Node.js version too old
**Fix**: Upgrade Node.js to 22.13+ or use `nvm use 22.13`

## Related Knowledge

- MEMORY.md line 78: "Hardhat v3 + Node.js version constraint"
