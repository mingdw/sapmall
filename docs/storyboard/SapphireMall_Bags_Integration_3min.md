# Sapphire Mall × Bags 集成说明片 · 分镜表（约 3:00 · 16:9）

> **已定稿规格**（来自制片确认）  
> - **A** 项目特点 + Bags 集成价值 + 现有功能概念展示  
> - **B** ~**180s**  
> - **C** **16:9**  
> - **D** 暗色 Web3 + UI 示意，贴近 `design/specs/Design_Spec.md`  
> - **E** 旁白中文；字幕 **中英双语**（脚本见 `docs/scripts/SapphireMall_Bags_Integration_3min_voiceover.md`）  
> - **F** **无真实录屏**；画面用 **AI 静帧 + 占位图链接**（后期可替换）  
> - **G** **必要时露出 Bags 标识**（建议成片叠加 **官方矢量 Logo**，AI 出图仅用示意占位）  
> - **H** 无人物  
> - **I** 含 **静帧 prompt + motion prompt + 旁白脚本**

---

## 1. 全局风格块（每条静帧 Prompt 前缀粘贴）

```text
[STYLE] Dark Web3 product visualization, charcoal background #111827, glassmorphism panels, blue-purple gradient accents #3B82F6 to #8B5CF6, subtle UI glow, fictional interface mockup, no legible real-world trademark except where noted for Bags placeholder, 16:9 cinematic composition, no human characters, ultra clean vector-like UI shapes
```

**负面提示（每条可追加）**

```text
[NEGATIVE] human face, crowded text, watermark, distorted typography, fake Ethereum logo misuse, photorealistic hands
```

---

## 2. 占位图规范（后期替换）

| 占位 ID | 建议替换为 |
|---------|------------|
| `IMG_LOGO_SAPPHIRE` | `design/prototypes/favicon.svg` 或导出的 PNG |
| `IMG_LOGO_BAGS` | Bags **官方**品牌包矢量（投放前确认授权） |
| `IMG_SCENE_XX` | 按镜号保存 AI 出图 `exports/scene_XX.png` |

Markdown 中统一写作：**`![描述](PLACEHOLDER:IMG_SCENE_01)`**，剪辑时可改为 URL 或本地路径。

---

## 3. 分镜总表

| 镜号 | 时长 | 累计结束 | 画面概述 | 占位图 |
|------|------|----------|----------|--------|
| 01 | 10s | 0:10 | 标题卡：Sapphire Mall + 宝石感抽象图形 | `PLACEHOLDER:IMG_SCENE_01` |
| 02 | 14s | 0:24 | DAO + SAP + 社区节点抽象网络 | `PLACEHOLDER:IMG_SCENE_02` |
| 03 | 14s | 0:38 | 「购物车 / 合约」过重 vs 「闪电传播」对比概念 | `PLACEHOLDER:IMG_SCENE_03` |
| 04 | 12s | 0:50 | 虚构商城货架 / 商品卡片 UI | `PLACEHOLDER:IMG_SCENE_04` |
| 05 | 10s | 1:00 | 虚构兑换 / 资产卡片 UI | `PLACEHOLDER:IMG_SCENE_05` |
| 06 | 10s | 1:10 | 虚构 DAO / 提案卡片 UI | `PLACEHOLDER:IMG_SCENE_06` |
| 07 | 8s | 1:18 | 虚构帮助中心 / FAQ 面板 | `PLACEHOLDER:IMG_SCENE_07` |
| 08 | 14s | 1:32 | 导航条高亮「生态活动」、Rewards 模块示意 | `PLACEHOLDER:IMG_SCENE_08` |
| 09 | 16s | 1:48 | **Bags** 标识区域 + Solana 粒子点缀（Logo 建议后期换官方素材） | `PLACEHOLDER:IMG_SCENE_09` + `IMG_LOGO_BAGS` |
| 10 | 14s | 2:02 | 左右分屏：左 EVM 结账图标流 / 右 Bags launch 示意 | `PLACEHOLDER:IMG_SCENE_10` |
| 11 | 14s | 2:16 | 图标：购物车 ≠ 礼品盒（活动）；SAP 币与「活动代币」视觉分离 | `PLACEHOLDER:IMG_SCENE_11` |
| 12 | 14s | 2:30 | 三联：仅 EVM / 跳转外链 / Solana 小徽章（教育信息图） | `PLACEHOLDER:IMG_SCENE_12` |
| 13 | 14s | 2:44 | 两条链地址卡片 +「自愿绑定」虚线连接（无真人） | `PLACEHOLDER:IMG_SCENE_13` |
| 14 | 16s | 3:00 | 分层架构图：DApp 编排 → Bags 执行；叠化结尾文档 QR / URL 条（可选） | `PLACEHOLDER:IMG_SCENE_14` |

**累计校验**：10+14+14+12+10+10+8+14+16+14+14+14+14+16 = **180s**。

---

## 4. 逐镜 · 静帧 Prompt（英文，适用于 MJ / SD / 即梦等）

### 镜 01

```text
[STYLE] + Hero title card, abstract faceted sapphire gem composed of triangular facets glowing cyan and violet, typography area blank wide negative space center for Chinese title "Sapphire Mall", minimal sci-fi grid floor reflection, premium tech keynote aesthetic
```

### 镜 02

```text
[STYLE] + Abstract network graph nodes linked by luminous lines, subtle coin-like disc labeled abstract SAP glyph (non-real currency), DAO voting motif as floating glass cards with checkmarks, dark background depth haze
```

### 镜 03

```text
[STYLE] + Split metaphor illustration: left heavy concrete blocks labeled abstract icons for shopping cart and smart contract pile; right side lightning bolts and share nodes lightweight, contrast optimistic purple-blue lighting
```

### 镜 04

```text
[STYLE] + Fictional marketplace dashboard, grid of digital product cards with placeholder thumbnails, left sidebar categories, top bar search field blurred, glass panels, sapphire accent icons
```

### 镜 05

```text
[STYLE] + Fictional exchange desk UI, two-panel swap layout with abstract token circles, arrow between pools, warning stripe subtle amber for risk hint, dark theme
```

### 镜 06

```text
[STYLE] + Fictional DAO proposals list UI, pill status tags, purple accent progress bars, timeline visualization, no readable long text
```

### 镜 07

```text
[STYLE] + Fictional help center layout, accordion FAQ panels, shield icon for safety, calm blue highlights, generous whitespace
```

### 镜 08

```text
[STYLE] + Fictional horizontal navigation bar highlight on tab labeled abstract Chinese characters area as glowing chip "Ecosystem / Rewards", main canvas shows campaign cards stack, Marketplace tab dimmed secondary state
```

### 镜 09

```text
[STYLE] + Partnership slide aesthetic, reserved rectangular logo lockup area center for Bags wordmark placeholder (generic geometric bag silhouette only, not exact trademark), Solana-inspired gradient purple-green aurora subtle in background particles, disclaimer microcopy area blank bottom
```
**后期**：在 **`IMG_LOGO_BAGS`** 官方文件上叠加替换 AI 占位框。

### 镜 10

```text
[STYLE] + Diptych composition: left panel Ethereum hexagon motif abstract checkout flow wireframe; right panel rocket launch trajectory curves abstract hinting token launch platform, central vertical glow divider
```

### 镜 11

```text
[STYLE] + Infographic, large crossed separation between shopping cart icon and gift-sparkle campaign icon, two coin circles visually different silhouettes labeled abstract SAP vs campaign token placeholder shapes, educational flat layers
```

### 镜 12

```text
[STYLE] + Three-column infographic panels: (1) single wallet icon EVM only, (2) browser window with outgoing arrow external link, (3) Solana hex galaxy badge small, arrows clean isometric style, caption zones empty bottom third
```

### 镜 13

```text
[STYLE] + Two floating address plaque cards linked by dashed voluntary link chain glyph, hex string abstract blurred, lock icons open meaning optional consent, cool cyan and violet lighting
```

### 镜 14

```text
[STYLE] + Layered architecture diagram: top layer labeled abstract "Orchestration / DApp" with modules Marketplace Exchange DAO Help Rewards as rounded rectangles; downward arrows to bottom layer "Execution / Bags • Solana"; server cylinder icon tiny side note "API keys server-side only"
```

---

## 5. 逐镜 · Motion Prompt（Runway / Pika / Kling 等）

可将 **对应静帧** 作为首帧垫图，再附加：

| 镜号 | Motion Prompt（英文） |
|------|------------------------|
| 01 | Slow camera dolly forward, gem facets shimmer rotating light sweep, particles drift upward subtly, 4s loop segment extended in editor |
| 02 | Nodes pulse sequentially along edges, soft depth parallax, SAP disc subtle rotation |
| 03 | Left heavy blocks slight shake vs right lightning pulses brighter every 2 seconds |
| 04 | Horizontal slow pan across product grid, UI cards gentle floating amplitude 2px |
| 05 | Abstract swap arrow oscillates glow intensity, pool circles breathe scale 98%-100% |
| 06 | Proposal cards slide in from bottom staggered 0.3s |
| 07 | FAQ accordion expand hint motion blur fake one cycle |
| 08 | Nav chip glow pulses, campaign cards stack slight parallax depth |
| 09 | Aurora particles flow diagonal, logo lockup area **static** for later composite |
| 10 | Divider beam pulses vertically, left/right panels independent micro motion |
| 11 | Icons separate then snap back with elastic easing educational emphasis |
| 12 | Three columns sequential highlight sweep left to right |
| 13 | Dashed link animates drawing on, plaques subtle tilt toward each other |
| 14 | Layer blocks separate vertically then reconnect with arrow flow; last 4 seconds gentle fade toward blank footer zone for titles / doc URL overlay |

---

## 6. 剪辑与包装清单

- [ ] 导入 **14** 条静帧或视频片段，按时间线对齐 `*_voiceover.md`  
- [ ] 叠加 **中英字幕**（样式：白字 + 暗描边或半透明条）  
- [ ] 镜 **09**：**合成官方 Bags Logo**（授权合规）  
- [ ] 片尾：`README` / `docs/Bags_Activity_Marketing_PRD.md` **二维码或 URL 条**（可选）  
- [ ] 低保真旁白轨：可先 **TTS 打底**再换人声

---

## 7. 相关文档

- 旁白与中英字幕：`docs/scripts/SapphireMall_Bags_Integration_3min_voiceover.md`  
- 工具包与通用模板：`docs/Storyboard_AI_Prompt_Kit.md`  
- 产品口径：`docs/Bags_Activity_Marketing_PRD.md`、`README.md`  
- 视觉色彩：`design/specs/Design_Spec.md`
