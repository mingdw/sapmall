import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export type DeploymentRecord = {
  network: string;
  chainId: number;
  deployedAt: string;
  deployer: `0x${string}`;
  admin: `0x${string}`;
  settlementVault: `0x${string}`;
  paymentRouter: `0x${string}`;
  paymentRouterImplementation: `0x${string}`;
  platformConfig: `0x${string}`;
  platformConfigImplementation: `0x${string}`;
  paymentConfig: {
    paymentToken: `0x${string}`;
    chainId: number;
  };
  platformConfigAdmin: `0x${string}`;
};

export async function saveDeployment(record: DeploymentRecord) {
  const dir = path.join(process.cwd(), "deployments");
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `${record.chainId}.json`);
  await writeFile(file, `${JSON.stringify(record, null, 2)}\n`, "utf8");
  console.log("Saved deployment record:", file);
}
