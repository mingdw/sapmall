---
name: frontend-backend-type-sync
description: Synchronize frontend TypeScript types with backend Go API changes. Ensures all 4 files in the chain are updated when adding/modifying fields.
---

# Frontend-Backend Type Synchronization

When backend adds or modifies a field, you MUST update all 4 files in this exact order:

## The 4-File Chain

1. **Go Model** (`backend_service/app/internal/model/*.go`)
   - Add/modify field in struct
   - Update GORM tags if needed

2. **types.go** (`backend_service/app/api/*/types.go`)
   - Add/modify field in API response struct
   - Ensure JSON tags match frontend expectations

3. **TypeScript Types** (`web_client/*/src/services/api/*.ts`)
   - Add/modify field in interface
   - Update any mock data if applicable

4. **Form Components** (`web_client/*/src/pages/*/components/*.tsx`)
   - Add form field if new
   - Update display logic if modified
   - Update validation if needed

## Verification Checklist

- [ ] Go model field name matches types.go
- [ ] types.go JSON tag matches TypeScript interface
- [ ] TypeScript interface used in API calls
- [ ] Form component renders new field
- [ ] i18n keys added for labels/placeholders
- [ ] SCSS module has required styles

## Common Patterns

### Adding a new field (e.g., `skuImgs`)
```typescript
// types.go
type OrderInfo struct {
    // ... existing fields
    SkuImgs string `json:"skuImgs,omitempty"`
}

// orderApi.ts
export interface OrderInfo {
    // ... existing fields
    skuImgs?: string;
}

// Form component
{order.skuImgs && (
  <div className={styles.skuImages}>
    {/* render images */}
  </div>
)}
```

### Field type changes
- `number` → `string`: Update TypeScript type, update display logic
- `boolean` → `number` (0/1): Add conversion in form submit handler
- `string` → `object`: Parse JSON in component

## Anti-Patterns

- ❌ Updating only frontend without backend
- ❌ Forgetting mock data in development
- ❌ Missing i18n keys for new labels
- ❌ Not updating API documentation

## Related Knowledge

- MEMORY.md lines 90, 101: "Frontend type alignment after backend refactor"
- Pattern applies to all 3 frontend apps (admin, dapp, website)
