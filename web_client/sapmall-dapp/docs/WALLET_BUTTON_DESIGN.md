# Web3 钱包按钮设计说明

## 设计理念

### 核心原则
1. **简洁现代** - 符合 Web3 的极简美学
2. **层次分明** - 未连接/已连接状态清晰区分
3. **交互反馈** - 悬停、点击有明确的视觉反馈
4. **品牌一致** - 使用 sapphire 蓝紫渐变色系

### 设计 Token

```
COLOR PALETTE
├── Primary Gradient: #3b82f6 → #8b5cf6 (蓝到紫)
├── Background Dark: #0f172a (深色背景)
├── Card Background: #1e293b (卡片背景)
├── Border Glow: rgba(139, 92, 246, 0.3) (紫色边框)
├── Success Green: #22c55e (连接状态指示)
└── Danger Red: #ef4444 (断开连接)

TYPOGRAPHY
├── Address: 'SF Mono', 'Fira Code', monospace (等宽字体)
├── Button Text: System font, 600 weight
└── Menu Items: System font, 400 weight

SPACING
├── Button Padding: 10px 20px
├── Border Radius: 12px
├── Menu Item Padding: 10px 12px
└── Dropdown Gap: 8px
```

## 组件结构

### 1. 未连接状态 (Connect Button)

```
┌─────────────────────────────────┐
│  💳  连接钱包                    │
│  ─────────────────────────────  │
│  [渐变背景 + 悬停发光效果]       │
└─────────────────────────────────┘
```

**特性：**
- 蓝紫渐变背景
- 钱包图标 + 文字
- 悬停时发光扫过效果
- 悬停时上浮 + 阴影

### 2. 已连接状态 (Connected Button)

```
┌─────────────────────────────────┐
│  🟢  0x1234...5678      ▼      │
│  ─────────────────────────────  │
│  [深色背景 + 紫色边框]           │
└─────────────────────────────────┘
```

**特性：**
- 深色背景 + 紫色边框
- 绿色状态指示点
- 等宽字体显示地址
- 箭头图标可展开菜单

### 3. 下拉菜单 (Dropdown)

```
┌─────────────────────────────────┐
│  💳 已连接钱包                   │
├─────────────────────────────────┤
│  0x1234567890abcdef12345678...  │
├─────────────────────────────────┤
│  📋 复制地址                     │
│  🔗 在区块浏览器查看             │
│  🚪 断开连接                     │
└─────────────────────────────────┘
```

**特性：**
- 圆角卡片设计
- 紫色发光阴影
- 地址全显示
- 操作按钮带图标

## 交互效果

### 悬停状态
- 按钮上浮 2px
- 添加发光阴影
- 背景扫光效果

### 点击状态
- 按钮下沉
- 即时反馈

### 下拉菜单
- 淡入 + 上滑动画
- 背景模糊效果（可选）

## 响应式设计

### 桌面端 (>640px)
- 完整显示地址
- 下拉菜单固定宽度

### 移动端 (<640px)
- 隐藏地址文字
- 只显示状态点
- 下拉菜单自适应宽度

## 使用方式

### 基础用法

```tsx
import Web3WalletButton from './Web3WalletButton';

// 在 Header 中使用
<Web3WalletButton />
```

### 与 RainbowKit 集成

```tsx
import { ConnectButton } from '@rainbow-me/rainbowkit';

// 使用 RainbowKit 的 ConnectButton.Custom
<ConnectButton.Custom>
  {({ openConnectModal }) => (
    <button onClick={openConnectModal}>
      连接钱包
    </button>
  )}
</ConnectButton.Custom>
```

## 与现有代码的对比

### 之前 (Ant Design Button)
```tsx
<Button type="primary" icon={<Wallet size={16} />}>
  {t('walletConnect.connectWallet')}
</Button>
```

**问题：**
- 样式单一
- 缺少 Web3 感
- 没有状态指示

### 之后 (Web3WalletButton)
```tsx
<button className={styles.connectButton}>
  <Wallet size={18} />
  <span>{t('walletConnect.connectWallet')}</span>
</button>
```

**改进：**
- 渐变背景
- 悬停发光效果
- 状态指示点
- 等宽字体地址
- 下拉菜单

## 文件清单

```
src/pages/header/components/
├── Web3WalletButton.tsx          # 主组件
├── Web3WalletButton.module.scss  # 样式文件
└── WalletConnectExample.tsx      # 使用示例
```

## 下一步

1. 将 `Web3WalletButton` 集成到 `HeaderPageDetail.tsx`
2. 替换现有的 `WalletConnect` 组件
3. 测试响应式效果
4. 添加动画库（如 framer-motion）增强交互

## 参考

- [RainbowKit Docs](https://www.rainbowkit.com/docs)
- [Wagmi Hooks](https://wagmi.sh/react/hooks)
- [Web3 Design Patterns](https://web3design.dev/)
