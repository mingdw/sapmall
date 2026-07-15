---
name: icon-migration-pattern
description: Migrate Font Awesome and Ant Design Icons to Lucide React across all frontend apps.
---

# Icon Migration Pattern (FA/Ant Design → Lucide React)

## Migration Rules

### 1. Icon Library Replacement

| Old | New |
|-----|-----|
| `import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'` | `import { IconName } from 'lucide-react'` |
| `import { AntDesignIcon } from '@ant-design/icons'` | `import { IconName } from 'lucide-react'` |
| `<FontAwesomeIcon icon="fas fa-xxx" />` | `<IconName size={16} />` |

### 2. Brand Icons (No Lucide Equivalent)

Twitter, Telegram, Discord, Github → Use semantic substitutes:
- Twitter → `ExternalLink` or `Send`
- Telegram → `Send`
- Discord → `MessageCircle`
- Github → `Code2`

### 3. Data File Pattern

For data files mapping codes to icons:

```typescript
// Before (string-based)
const categoryIcons: Record<string, string> = {
  electronics: 'fas fa-laptop',
  clothing: 'fas fa-tshirt',
};

// After (LucideIcon component)
import { LucideIcon, Laptop, Shirt } from 'lucide-react';

const categoryIcons: Record<string, LucideIcon> = {
  electronics: Laptop,
  clothing: Shirt,
};
```

### 4. API String Resolver

For backend strings still in `"fas fa-xxx"` format:

```typescript
const FA_TO_LUCIDE: Record<string, LucideIcon> = {
  'fa-laptop': Laptop,
  'fa-tshirt': Shirt,
  'fa-home': Home,
};

function resolveApiIcon(faClass: string): LucideIcon | undefined {
  const iconName = faClass.replace('fas ', '').replace('far ', '');
  return FA_TO_LUCIDE[iconName];
}
```

### 5. Dynamic Icon Rendering

```typescript
// ✅ Correct
const Icon = theme.icon;
return <Icon size={16} />;

// ❌ Incorrect (invalid JSX)
return <theme.icon size={16} />;
```

### 6. Ant Design Button Icon

```typescript
// Ant Design accepts ReactNode
<Button icon={<LucideIcon size={16} />}>Label</Button>
```

### 7. Heart Filled/Outline

```typescript
<Heart size={16} fill={isActive ? 'currentColor' : 'none'} />
```

### 8. ChevronDown Rotation

```typescript
// Before
<DownOutlined rotate={isActive ? 180 : 0} />

// After
<ChevronDown
  size={16}
  style={{
    transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.2s',
  }}
/>
```

## Migration Checklist

- [ ] Remove FA/Ant Design imports
- [ ] Add Lucide imports
- [ ] Replace JSX elements
- [ ] Update data files to use `LucideIcon` type
- [ ] Add `FA_TO_LUCIDE` resolver if backend sends FA strings
- [ ] Verify dynamic rendering uses correct pattern
- [ ] Test all icon sizes and states

## Related Knowledge

- MEMORY.md lines 62-73: Icon migration patterns
- MEMORY.md line 33: "Frontend icon library: Lucide React only"
