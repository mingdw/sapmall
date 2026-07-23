# CCTP V2 配置（仓库内）

见 [`../deployments/cctp-v2.json`](../deployments/cctp-v2.json)。

- Arc Testnet domain **26**
- Base Sepolia domain **6**
- TokenMessengerV2 / MessageTransmitterV2 测试网地址与 Circle/Arc 文档一致

`SAPSwapRouter` 已增加 `swapWithPermit`（EIP-2612），用于目的链减签；部署后需重新升级 Router 代理方可在链上使用。
