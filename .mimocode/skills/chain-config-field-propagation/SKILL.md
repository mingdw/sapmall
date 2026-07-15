---
name: chain-config-field-propagation
description: Propagate new fields through the 5-file chain when modifying sys_chain_network table.
---

# Chain Config Field Propagation

When adding new fields to `sys_chain_network` table, you MUST update all 5 places:

## The 5-File Chain

1. **Go Model** (`backend_service/app/internal/model/sys_chain_network.go`)
   - Add field with GORM tags
   - Update `TableName()` if needed

2. **types.go** (`backend_service/app/api/*/types.go`)
   - Add field to `ChainNetworkInfo` response struct
   - Ensure JSON tag matches frontend

3. **chain_mapper.go** (`backend_service/app/internal/mapper/chain_mapper.go`)
   - Add field to `ToChainNetworkInfo()` conversion
   - Add field to `CreateModelFromInfo()` if writable

4. **save_chain_network_logic.go** (`backend_service/app/internal/logic/*/save_chain_network_logic.go`)
   - Add field to updates map in `Update()`
   - Add field to `CreateModel()` if new record

5. **Frontend** (`web_client/*/src/pages/system/chainnetwork/`)
   - Add to TypeScript types (`types.ts`)
   - Add to form component (`ChainNetworkDetail.tsx`)
   - Add to table columns if display field (`ChainNetworkList.tsx`)

## Field Type Mapping

| Go Type | TypeScript Type | Form Control |
|---------|-----------------|--------------|
| `int64` | `number` | `InputNumber` |
| `string` | `string` | `Input` |
| `bool` | `boolean` | `Switch` |
| `time.Time` | `string` | `DatePicker` |

## Boolean Field Convention

Backend uses `0=enabled, 1=disabled`. Frontend Ant Design Switch:
- Form load: `value === 0` → `true` (enabled)
- Form submit: `true ? 0 : 1`

## Verification Checklist

- [ ] Go model field has correct GORM tag
- [ ] types.go JSON tag matches frontend interface
- [ ] chain_mapper.go converts field correctly
- [ ] save_chain_network_logic.go persists field
- [ ] Frontend types.ts has field
- [ ] Frontend form renders field
- [ ] Migration SQL created if needed

## Migration Script Location

`backend_service/app/internal/sql/migration/`

## Related Knowledge

- MEMORY.md line 109: "Chain config save logic must include ALL fields"
- MEMORY.md line 79: "sys_chain_network table redesign"
