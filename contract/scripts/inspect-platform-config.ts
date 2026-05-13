/**
 * 只读：拉取已部署 PlatformConfig（代理）合约中的「全部 key」及每条「完整详情」。
 *
 * 用法（依赖 .env 的 RPC；仅 eth_call，不写链）：
 *   cd contract
 *   npx hardhat run scripts/inspect-platform-config.ts --network lineaSepolia
 *
 * 代理地址：命令行第一个 `0x...` > 环境变量 PLATFORM_CONFIG_PROXY_ADDRESS
 *
 * 其它网络：将 --network 换为 sepolia 等（需在 hardhat.config.ts 已配置）。
 */
import "dotenv/config";
import { network } from "hardhat";
import { isAddress } from "viem";

function jsonLine(obj: unknown): string {
  return JSON.stringify(
    obj,
    (_k, v) => (typeof v === "bigint" ? v.toString() : v),
    2,
  );
}

function parseProxyArg(argv: string[]): `0x${string}` | undefined {
  for (const a of argv) {
    if (isAddress(a)) {
      return a as `0x${string}`;
    }
  }
  return undefined;
}

async function main() {
  const proxyArg = parseProxyArg(process.argv.slice(2));
  const proxy =
    proxyArg ?? (process.env.PLATFORM_CONFIG_PROXY_ADDRESS as `0x${string}` | undefined);
  if (!proxy || !isAddress(proxy)) {
    throw new Error(
      [
        "缺少代理地址：请在命令行第一个参数传入 0x...，或设置 .env 里的 PLATFORM_CONFIG_PROXY_ADDRESS",
        "示例: npx hardhat run scripts/inspect-platform-config.ts --network lineaSepolia",
        "      npx hardhat run scripts/inspect-platform-config.ts --network lineaSepolia 0xYourProxy",
      ].join("\n"),
    );
  }

  const hreNetwork = await network.connect();
  const { viem } = hreNetwork;
  const publicClient = await viem.getPublicClient();
  const code = await publicClient.getBytecode({ address: proxy });
  if (!code || code === "0x") {
    throw new Error(
      `地址 ${proxy} 在当前网络无合约代码，请检查 --network 是否与该代理部署链一致（Linea Sepolia / Sepolia 等）。`,
    );
  }

  const config = await viem.getContractAt("PlatformConfig", proxy);

  const chainId = await publicClient.getChainId();
  let paused: boolean | undefined;
  try {
    paused = await config.read.paused();
  } catch {
    paused = undefined;
  }
  const total = await config.read.totalConfigs();

  console.log("========== PlatformConfig：全部 key 与详情（只读）==========");
  console.log("chainId:     ", chainId.toString());
  console.log("proxy:       ", proxy);
  if (paused !== undefined) {
    console.log("paused:      ", paused);
  }
  console.log("totalConfigs:", total.toString());
  console.log("");

  if (total === 0n) {
    console.log("（合约中无任何配置项）");
    console.log("===========================================================");
    return;
  }

  const allKeys = await config.read.getAllKeys();
  const [items, totalListed] = await config.read.listConfigs([0n, total]);

  if (BigInt(allKeys.length) !== total || totalListed !== total) {
    console.warn(
      "[warn] getAllKeys / listConfigs 与 totalConfigs 数量不一致:",
      `keys=${allKeys.length} items=${items.length} totalListed=${totalListed} total=${total}`,
    );
  }

  console.log("--- getAllKeys（顺序与 listConfigs 一致）---");
  console.log(allKeys.join(", "));
  console.log("");
  console.log("--- listConfigs(0, total) 原始结构（JSON）---");
  console.log(jsonLine(items));
  console.log("");
  console.log("--- 逐条易读（并与 getConfig(key) 交叉校验）---");

  for (let i = 0; i < items.length; i++) {
    const row = items[i];
    const fromList = row;
    const fromGet = await config.read.getConfig([row.key]);

    const mismatch =
      fromGet.key !== fromList.key ||
      fromGet.value !== fromList.value ||
      fromGet.valueType !== fromList.valueType ||
      fromGet.description !== fromList.description ||
      fromGet.status !== fromList.status ||
      fromGet.updatedAt !== fromList.updatedAt ||
      fromGet.updatedBy.toLowerCase() !== fromList.updatedBy.toLowerCase();

    console.log(`\n[${i}] ${row.key}${mismatch ? "  ⚠ listConfigs 与 getConfig 不一致" : ""}`);
    console.log(`    value:        ${row.value}`);
    console.log(`    valueType:    ${row.valueType}`);
    console.log(`    description:  ${row.description}`);
    console.log(`    status:       ${row.status}`);
    console.log(`    updatedAt:    ${row.updatedAt.toString()}`);
    console.log(`    updatedBy:    ${row.updatedBy}`);
    if (row.valueType === "number") {
      try {
        const u = await config.read.getConfigUintValue([row.key]);
        console.log(`    uint256:      ${u.toString()}`);
      } catch {
        console.log("    uint256:      (getConfigUintValue 失败，略过)");
      }
    }
  }

  console.log("");
  console.log("===========================================================");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
