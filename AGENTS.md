# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Sapphire Mall (sapmall) is a Web3 virtual goods trading platform. It is a monorepo with 4 sub-projects:

| Service | Path | Tech | Dev Port |
|---|---|---|---|
| Backend API | `backend_service/app/` | Go 1.23+ / go-zero / GORM | 8888 |
| Admin Panel | `web_client/sapmall-admin/` | React 18 / TypeScript / CRA | 3004 |
| DApp | `web_client/sapmall-dapp/` | React 18 / TypeScript / CRA + Web3 | 3005 |
| Website | `web_client/sapmall-website/` | React 19 / TypeScript / CRA | 3006 |

### Infrastructure (Docker)

MySQL 8.0, Redis 7.2 must run before the backend starts. Start them with Docker:

```bash
sudo dockerd &>/tmp/dockerd.log &
sleep 3
sudo docker start sapmall-mysql sapmall-redis 2>/dev/null || {
  sudo docker run -d --name sapmall-mysql -e MYSQL_ROOT_PASSWORD=root123456 -e MYSQL_DATABASE=sapphire_mall -p 3306:3306 mysql:8.0 --default-authentication-plugin=mysql_native_password
  sudo docker run -d --name sapmall-redis -p 6379:6379 redis:7.2-alpine
}
```

Wait for MySQL readiness before importing schema:
```bash
sudo docker exec sapmall-mysql mysqladmin ping -uroot -proot123456 --silent
sudo docker cp backend_service/docs/sapphire_mall_schema.sql sapmall-mysql:/tmp/schema.sql
sudo docker exec sapmall-mysql bash -c 'mysql -uroot -proot123456 sapphire_mall < /tmp/schema.sql'
```

### Backend config

The dev config `backend_service/app/etc/sapmall_dev.yaml` is gitignored. If it doesn't exist, create it with DB host `127.0.0.1:3306`, user `root`, password `root123456`, database `sapphire_mall`, Redis `127.0.0.1:6379`, and empty Cos config. All config fields (Version, DB, Redis, Auth, Cos) are required by the go-zero strict config loader.

### Running the backend

```bash
cd backend_service/app
go build -o /tmp/sapmall_server sapmall_start.go
/tmp/sapmall_server -f etc/sapmall_dev.yaml
```

Verify: `curl http://localhost:8888/api/common/version`

### Running the frontends

All three frontend apps require `npm install --legacy-peer-deps` (react-scripts 5.0.1 has peer dep conflicts with TypeScript 5.x).

```bash
cd web_client/sapmall-admin && BROWSER=none PORT=3004 npx react-scripts start
cd web_client/sapmall-dapp && BROWSER=none PORT=3005 npx react-scripts start
cd web_client/sapmall-website && BROWSER=none PORT=3006 npx react-scripts start
```

### Known pre-existing issues

- **Admin panel**: Has TypeScript compilation errors (TS2339) in `ProductFormnew.tsx` — `uploadFile` and `deleteFiles` properties missing on the commonApiService type. The error overlay appears but the app compiles and serves.
- **DApp**: Requires a WalletConnect Cloud `projectId` to render properly (external dependency). Without it, a runtime error about missing projectId appears.
- **Backend `go vet`**: Reports unreachable code in `get_all_address_logic.go`.
- **Login**: Uses Ethereum wallet signature (Web3); there is no username/password login.

### Lint and test commands

- Go lint: `cd backend_service && go vet ./...`
- Go test: `cd backend_service && go test ./...` (no test files currently)
- Frontend ESLint (example): `cd web_client/sapmall-admin && npx eslint src/ --ext .ts,.tsx`
- Website tests: `cd web_client/sapmall-website && CI=true npx react-scripts test --watchAll=false`
