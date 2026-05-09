# Sapphire Mall · 分镜 AI 提示词与素材清单（工具包）

> **用途**：为宣传片 / 教程短片 / 投放素材生成 **分镜表 + 单帧 AI 绘图提示词 + 视频工具提示**，并列出需准备的 **图片、脚本、文档**。  
> **状态**：**已定稿一版 3 分钟说明片** — 见 `docs/storyboard/SapphireMall_Bags_Integration_3min.md` 与 `docs/scripts/SapphireMall_Bags_Integration_3min_voiceover.md`。下列 §0 保留作 **后续新成片** 复用模板。

---

## 0. 制片确认表（模板 · 当前项目已填）

| # | 问题 | 当前成片取值 |
|---|------|----------------|
| A | **成片类型** | 项目特点 + **Bags 集成价值** + 现有功能 **概念**展示 |
| B | **时长** | **约 180s（3:00）**，叙事旁白为主 |
| C | **画幅** | **16:9** |
| D | **视觉风格** | **暗色 Web3 + 虚构 UI**，贴近 `design/specs/Design_Spec.md` |
| E | **语言** | 旁白 **中文**；字幕 **中英双语** |
| F | **界面来源** | **无真实录屏**；**占位图 / AI 静帧** |
| G | **Bags 标识** | **必要镜次露出**（镜 09 建议后期叠 **官方 Logo**） |
| H | **人设** | **无人物** |
| I | **交付物** | **静帧 prompt + motion prompt + 旁白脚本**（均已写入上述两文件） |

**新开项目时**：复制本表空白「您的选择」列另行填写。

---

## 1. 建议准备的材料（清单）

### 1.1 文档类（.md 或可直接粘贴的文本）

| 材料 | 路径或说明 | 用途 |
|------|------------|------|
| 叙事与边界 | `README.md`、`docs/Bags_Activity_Marketing_PRD.md` | 口径：主站 EVM / 活动与 Bags / 非人人双钱包 |
| 视觉规范摘录 | `design/specs/Design_Spec.md`（色彩、组件气质） | 统一蓝紫渐变、暗色 Web3、玻璃拟态等关键词 |
| **旁白脚本 v1** | 新建 `docs/scripts/<成片名>_voiceover.md`（建议） | 按镜头拆句，标注秒数 |
| **分镜表终稿** | 本文 §4 复制为新文件 `docs/storyboard/<成片名>_shots.md` | 制片与甲方对齐 |

### 1.2 图片与品牌素材

| 素材 | 路径参考 | 用途 |
|------|----------|------|
| Logo / 字标 | `design/prototypes/favicon.svg`、`web_client/sapmall-dapp/src/assets/logo-mark.svg` | 尾板、角标、参考图垫图（img2img） |
| UI 截图（若选真实界面） | 自建 `design/storyboard/refs/screenshots/*.png` | 控制布局；注意脱敏测试地址 |
| 氛围参考 mood board | 自建 `design/storyboard/refs/mood/*.jpg` | 统一光影与饱和度 |
| （可选）第三方 | Bags 官方品牌规范 **若对外投放需自行取得授权** | 仅在与 §0-G 一致时使用 |

### 1.3 工程与录屏（可选）

- 本地运行 `sapmall-dapp`，按分镜路由 **录制 1080p 以上** 短片段；文件名建议：`screen_marketplace.mp4`、`screen_rewards.mp4`。

---

## 2. 全局风格块（复制到每条图像 prompt 前）

以下与 `Design_Spec.md` 对齐，可按 §0-D 替换为「扁平 MG」等：

```text
[STYLE] Dark futuristic Web3 dashboard aesthetic, deep charcoal background #111827, subtle blue-purple gradient accents (#3B82F6 to #8B5CF6), glassmorphism panels, soft bloom, high clarity UI mockup style, no illegible tiny text, 16:9 cinematic composition, professional product visualization
```

**负面提示（通用，按需删减）**：

```text
[NEGATIVE] cluttered watermark, random logos, distorted fingers, low resolution, subtitle burn-in, misleading financial guarantees, photorealistic human face unless specified
```

---

## 3. 分镜 AI 提示词模板

### 3.1 静帧（Midjourney / SD / 即梦 / 可灵 图生图 等）

每条镜头建议格式：

```text
[STYLE] + [SUBJECT] + [COMPOSITION] + [LIGHTING] + [CAMERA] + [NEGATIVE]
```

**示例镜头（概念 UI，非真实截图）**：

```text
[STYLE]（粘贴 §2 全局风格块）
[SUBJECT] fictional Sapphire Mall dapp header with wallet connect button and navigation tabs Marketplace Exchange DAO Rewards, stylized gem logo mark, no readable real trademark
[COMPOSITION] hero shot, generous negative space on left for future Chinese title
[LIGHTING] rim light violet edge, soft UI glow
[CAMERA] 35mm, slight low angle, shallow depth of field on background
```

### 3.2 视频 / 动效分镜（Runway Gen-3 / Pika / Kling 等）

在静帧 prompt 基础上追加 **时间维度**：

```text
[MOTION] slow camera push-in, subtle parallax on UI layers, gentle particle dust, 4s loop-friendly, no harsh cuts
[CONSISTENCY] same color palette as previous shot, maintain layout silhouette
```

### 3.3 「生态活动 / Rewards」专用叙事镜头（与 PRD 一致）

```text
[SUBJECT] split visual metaphor: left panel labeled abstract "EVM checkout flow" with shopping cart icon; right panel labeled abstract "Solana activity external link" with arrow pointing to separate portal frame — educational infographic, not a real Bags screenshot
[CAPTION SPACE] bottom third clean for subtitles
```

---

## 4. 分镜表模板（复制后逐行填写）

| 镜号 | 时长(s) | 画面内容（给人类看的） | 旁白/字幕要点 | 静帧 prompt 摘要 | 素材依赖 |
|------|---------|------------------------|---------------|------------------|----------|
| 01 | | | | | |
| 02 | | | | | |
| … | | | | | |

---

## 5. 文档产出流程建议

1. **填 §0 确认表** → 定时长、风格、语言、是否露 Bags。  
2. 写 **`voiceover.md`**（旁白按句对齐秒数）。  
3. 填 **§4 分镜表**，每镜一条完整 **§3.1** prompt（可中英各一版若工具对中文支持弱）。  
4. 出 **关键帧** → 审阅 → 再跑视频 motion prompt 或剪辑包装。  
5. 终稿分镜与成片路径记入 `design/项目交付总结.md` 或单独制片 README（可选）。

---

## 6. 相关仓库文件

- 产品设计口径：`docs/Bags_Activity_Marketing_PRD.md`、`README.md`  
- 视觉规范：`design/specs/Design_Spec.md`  
- DApp 文案参考：`web_client/sapmall-dapp/src/i18n/locales/zh|en/translation.json`（`rewards.*`）

---

**下一步**：请直接回复 **§0 表格「您的选择」列**（或简略回答 A–I）。收到后我可以为本仓库 **生成一版填好的分镜表 + 逐镜完整英文/中文 prompt**（对应你选的类型与时长）。
