# Sapmall DAO 治理模块（DApp 内嵌）

## 页面地图

| 路由 | 页面 | 说明 |
|------|------|------|
| `/dao` | DAO 首页 | 社区脉搏：KPI、进行中投票、热门讨论、最新提案、我的治理侧栏 |
| `/dao/proposals` | 提案列表 | 筛选/排序、讨论中 Tab |
| `/dao/proposal/:id` | 提案详情 | 概览 / 讨论 / 投票记录 + 右侧投票面板（移动端底栏 + 抽屉） |
| `/dao/new` | 发起提案 | MVP 向导（mock 发布） |
| `/dao/delegates` | 委托中心 | 二期占位 |

## 目录结构

```
dao/
  DaoRoutes.tsx          # 嵌套路由
  DaoLayout.tsx          # max-w-7xl 容器
  types/                 # Proposal、VoteOption、Comment 等
  mocks/proposals.mock.ts
  utils/proposalUtils.ts
  components/            # 可复用 UI
  pages/                 # 路由页面
  styles/dao.shared.module.scss
```

## 数据与 API

- MVP：`mocks/proposals.mock.ts`（8 条样本，覆盖各状态）
- 投票/评论：`services/api/daoApiService.ts` 预留，当前为 mock + `message` toast
- 钱包：`wagmi` `useAccount`，投票权来自 `MOCK_MY_GOVERNANCE`

## 设计规范

对齐商品详情页：深色玻璃态、琥珀渐变 CTA、`SectionTitle` 左侧 3px 竖条、斑马纹表格。

## 二期规划

- [ ] 链上 Governor / Timelock 对接与签名校验
- [ ] 委托中心完整流程与代表排行榜
- [ ] 金库浏览与拨款执行追踪
- [ ] Snapshot 签名校验只读镜像（SAP-006 已演示 UI）
- [ ] 富文本 Markdown 渲染与附件上传
