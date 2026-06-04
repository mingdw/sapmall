# DApp 国际化文件规范

## 文件命名

按**顶部导航菜单**拆分，全部为 **JSON**（不再使用 `.ts` 文案文件）：

| 文件 | 导航 / 范围 | 典型 i18n 根键 |
|------|-------------|----------------|
| `translation_common.json` | 全局 | `common`, `header`, `navigation`, `user`, `walletConnect`, `homepage`, `footer` |
| `translation_marketplace.json` | 商城 | `marketplacePage`, `productDetail`, `payment`, `checkout` |
| `translation_rewards.json` | 生态活动 | `rewards` |
| `translation_exchange.json` | 兑换 | `exchange` |
| `translation_dao.json` | 社区参与 | `dao` |
| `translation_help.json` | 帮助中心 | `help`（`topicQa` 由代码在 `i18n/index.tsx` 注入） |

中英文各一份，目录：`locales/zh/`、`locales/en/`。

## 使用方式

组件内仍使用扁平命名空间，例如：

```tsx
t('navigation.marketplace')
t('payment.title')
t('help.hero.badge')
```

分片在 `src/i18n/index.tsx` 中合并为单个 `translation` 资源，**无需改现有 `t()` 键路径**。

## 维护

- 新增文案：写入对应模块 JSON，勿再扩大单文件 `translation.json`。
- 迁移脚本（可选）：`npm run i18n:split` / `npm run i18n:merge-extras`（见 `package.json` scripts）。

## 已废弃（勿新增）

- `translation.json`（整包）
- `help.json`、`marketplacePage.ts`、`paymentPage.ts`、`walletNetworkExtras.ts`、`productDetailExtras.ts`
