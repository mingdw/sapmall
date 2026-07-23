# CCTP 跨链兑换（Base Sepolia → Arc Testnet）

## 数据库迁移

```bash
mysql -u root -p sapphire_mall < docs/migrations/20260722_sys_cctp_swap_intent.sql
# 若表已存在，再执行：docs/migrations/20260723_alter_sys_cctp_swap_intent_meta.sql
```

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/cctp/intent/create` | 创建意图，返回 `depositForBurn` V2 参数 |
| POST | `/api/cctp/intent/burn-submitted` | 提交 burn 交易哈希，状态 → burned |
| GET | `/api/cctp/intent/:intent_id` | 查询意图状态（前端轮询） |
| POST | `/api/cctp/intent/swap-submitted` | 提交 Arc swap 交易哈希（可选） |

## YAML 配置（`etc/sapmall*.yaml`）

CCTP Relayer 配置写在配置文件的 `Cctp` 段，**不要用环境变量**：

```yaml
Cctp:
  Enabled: true
  IrisBaseURL: "https://iris-api-sandbox.circle.com"
  RelayerPrivateKey: ""   # 可空：仅 attestation；填写后自动 Arc mint
  ArcRPC: "https://rpc.testnet.arc.network"
  ArcMessageTransmitter: "0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275"
  PollIntervalSec: 12
```

### 行为说明

1. **仅 attestation**：`Enabled: true` 且未填 `RelayerPrivateKey` 时，Relayer 轮询 Iris，将 `burned` 意图推进到 `attested`。
2. **自动 mint**：额外配置 `RelayerPrivateKey` + `ArcRPC` 后，Relayer 在 Arc 调用 `MessageTransmitter.receiveMessage`，推进到 `minted`。
3. **前端 swap**：用户在 Arc 上执行 USDC→SAP swap 后，可调用 `swap-submitted` 记录最终状态。

## 本地启用 Relayer

1. 编辑 `etc/sapmall_dev.yaml`，将 `Cctp.Enabled` 设为 `true`；如需自动 mint，填写 `RelayerPrivateKey`（Relayer 钱包需有 Arc 测试网 gas）。
2. 启动：

```powershell
cd backend_service/app
go run sapmall_start.go -f ./etc/sapmall_dev.yaml
```

启动日志应出现：`[CCTP Relayer] 已启动，Iris=...`

## 状态机

| status | 含义 |
|--------|------|
| 0 | created |
| 1 | burned |
| 2 | attested |
| 3 | minted |
| 4 | swapped |
| 5 | failed |
