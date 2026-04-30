import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";
import { encodeFunctionData } from "viem";

describe("PlatformConfig", async function () {
  const { viem } = await network.create();
  const [admin] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  async function waitForTx(hash: `0x${string}`, label: string) {
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    const tx = await publicClient.getTransaction({ hash });
    console.log(`[${label}] txHash=${hash}`);
    console.log(`[${label}] blockNumber=${receipt.blockNumber.toString()}`);
    console.log(`[${label}] from=${tx.from}`);
    console.log(`[${label}] to=${tx.to ?? "contract creation"}`);
    return receipt;
  }

  async function deployAndInit() {
    const implementation = await viem.deployContract("PlatformConfig");
    const initData = encodeFunctionData({
      abi: implementation.abi,
      functionName: "initialize",
      args: [admin.account.address],
    });
    const proxy = await viem.deployContract("PlatformConfigProxy", [
      implementation.address,
      initData,
    ]);

    const config = await viem.getContractAt("PlatformConfig", proxy.address);
    return config;
  }

  it("initializes with default SAP bucket configs", async function () {
    const config = await deployAndInit();
    const total = await config.read.totalConfigs();
    assert.equal(total, 5n);

    const exists = await config.read.exists(["sap.token.bucket.community.cap"]);
    assert.equal(exists, true);
  });

  it("creates and reads config item", async function () {
    const config = await deployAndInit();
    const key = "app.feature.alpha";

    const createTx = await admin.writeContract({
      address: config.address,
      abi: config.abi,
      functionName: "createConfig",
      args: [key, "true", "boolean", "system", "alpha feature switch", 0],
    });
    await waitForTx(createTx, "createConfig");

    const item = await config.read.getConfig([key]);
    assert.equal(item.key, key);
    assert.equal(item.value, "true");
    assert.equal(item.valueType, "boolean");
    assert.equal(item.status, 0);
    assert.equal(item.exists, true);
  });

  it("updates existing config and rejects missing key update", async function () {
    const config = await deployAndInit();
    const key = "app.feature.beta";

    const createTx = await admin.writeContract({
      address: config.address,
      abi: config.abi,
      functionName: "createConfig",
      args: [key, "v1", "string", "system", "beta value", 0],
    });
    await waitForTx(createTx, "createConfig");

    const updateTx = await admin.writeContract({
      address: config.address,
      abi: config.abi,
      functionName: "updateConfig",
      args: [key, "v2", "string", "system", "beta value updated", 0],
    });
    await waitForTx(updateTx, "updateConfig");

    const item = await config.read.getConfig([key]);
    assert.equal(item.value, "v2");

    await assert.rejects(async () => {
      await admin.writeContract({
        address: config.address,
        abi: config.abi,
        functionName: "updateConfig",
        args: ["missing.key", "x", "string", "system", "missing", 0],
      });
    });
  });

  it("sets uint value for number config", async function () {
    const config = await deployAndInit();
    const key = "app.number.limit";

    const createTx = await admin.writeContract({
      address: config.address,
      abi: config.abi,
      functionName: "createConfig",
      args: [key, "100", "number", "system", "number config", 0],
    });
    await waitForTx(createTx, "createConfig");

    const setUintTx = await admin.writeContract({
      address: config.address,
      abi: config.abi,
      functionName: "setConfigUintValue",
      args: [key, 12345n],
    });
    await waitForTx(setUintTx, "setConfigUintValue");

    const uintValue = await config.read.getConfigUintValue([key]);
    assert.equal(uintValue, 12345n);
  });
});
