# Admin i18n 资源说明

- 语言权威：DApp 页头；通过 iframe `lang` + `postMessage({ type: 'SET_LOCALE' })` 同步到 Admin。
- 内部语言码：`zh` / `en`；API 头映射为 `zh-CN` / `en-US`。
- 分片文件按域拆分，由 `src/i18n/index.tsx` 经 `mergeTranslationBundles` 合并为单一 `translation` namespace。
- 校验：`npm run check:i18n`（中英 key 对拍）。

约定：

1. 用户可见文案使用 `t('...')`，禁止硬编码。
2. 表格 `columns` 在组件内用 `t()` 生成，勿在模块顶层写死中文 label。
3. 状态枚举选项提供 `getXxxOptions(t)` helper。
