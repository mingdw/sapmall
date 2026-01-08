# Web Client 本地开发与部署说明

本目录包含 Sapphire Mall 的三个前端子项目：

- `sapmall-website`：官网（Landing）
- `sapmall-dapp`：DApp（市场/兑换/DAO/帮助中心等）
- `sapmall-admin`：后台管理（普通用户/商家/管理员）

> 技术栈：React + TypeScript + TailwindCSS（均为 CRA / `react-scripts` 构建）

---

## 1. 环境要求

- Node.js：建议 `>= 18`
- npm：建议 `>= 9`

---

## 2. 依赖安装

三个子项目都需要分别安装依赖（首次运行或 lockfile 变更后）。

### 2.1 官网

```bash
cd web_client/sapmall-website
npm install --legacy-peer-deps
```

### 2.2 DApp

```bash
cd web_client/sapmall-dapp
npm install --legacy-peer-deps
```

### 2.3 后台管理

```bash
cd web_client/sapmall-admin
npm install --legacy-peer-deps
```

> 说明：由于 `react-scripts@5` 对 TypeScript 的 peer 依赖声明较旧，使用 `--legacy-peer-deps` 可避免安装时的依赖冲突。

---

## 3. 本地启动（开发模式）

三个项目的启动端口已在各自 `package.json` 中固定：

- 官网：`http://localhost:3006`
- 后台：`http://localhost:3004`
- DApp：`http://localhost:3005`

### 3.1 官网

```bash
cd web_client/sapmall-website
npm start
```

### 3.2 DApp

```bash
cd web_client/sapmall-dapp
npm start
```

### 3.3 后台管理

```bash
cd web_client/sapmall-admin
npm start
```

---

## 4. 构建（生产包）

### 4.1 官网

```bash
cd web_client/sapmall-website
npm run build
```

### 4.2 DApp

```bash
cd web_client/sapmall-dapp
npm run build
```

### 4.3 后台管理

```bash
cd web_client/sapmall-admin
npm run build
```

构建产物均在各自目录的 `build/` 下。

---

## 5. 静态部署（示例）

以 DApp 为例：

```bash
cd web_client/sapmall-dapp
npm run build
npx serve -s build -l 3005
```

---

## 6. 常见问题

### 6.1 `react-scripts: not found`

说明依赖未安装或安装失败。进入对应子项目目录重新执行：

```bash
npm install --legacy-peer-deps
```

