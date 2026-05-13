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
      args: [key, "true", "boolean", "alpha feature switch", 0],
    });
    await waitForTx(createTx, "createConfig");

    const item = await config.read.getConfig([key]);
    assert.equal(item.key, key);
    assert.equal(item.value, "true");
    assert.equal(item.valueType, "boolean");
    assert.equal(item.status, 0);
  });

  it("updates existing config and rejects missing key update", async function () {
    const config = await deployAndInit();
    const key = "app.feature.beta";

    const createTx = await admin.writeContract({
      address: config.address,
      abi: config.abi,
      functionName: "createConfig",
      args: [key, "v1", "string", "beta value", 0],
    });
    await waitForTx(createTx, "createConfig");

    const updateTx = await admin.writeContract({
      address: config.address,
      abi: config.abi,
      functionName: "updateConfig",
      args: [key, "v2", "string", "beta value updated", 0],
    });
    await waitForTx(updateTx, "updateConfig");

    const item = await config.read.getConfig([key]);
    assert.equal(item.value, "v2");

    await assert.rejects(async () => {
      await admin.writeContract({
        address: config.address,
        abi: config.abi,
        functionName: "updateConfig",
        args: ["missing.key", "x", "string", "missing", 0],
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
      args: [key, "100", "number", "number config", 0],
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
    const item = await config.read.getConfig([key]);
    assert.equal(item.value, "12345");
  });

  it("lists all keys and full config details via getAllKeys + listConfigs", async function () {
    const config = await deployAndInit();
    const total = await config.read.totalConfigs();
    assert.equal(total, 5n);

    const allKeys = await config.read.getAllKeys();
    assert.equal(allKeys.length, Number(total));

    const [items, totalListed] = await config.read.listConfigs([0n, total]);
    assert.equal(totalListed, total);
    assert.equal(items.length, Number(total));

    console.log("\n========== PlatformConfig：全量 key 与详情 ==========");
    console.log(`totalConfigs / listConfigs.total: ${total} / ${totalListed}`);
    console.log("getAllKeys:", allKeys.join(", "));
    for (let i = 0; i < items.length; i++) {
      const row = items[i];
      console.log(`\n[${i}] key:          ${row.key}`);
      console.log(`    value:        ${row.value}`);
      console.log(`    valueType:    ${row.valueType}`);
      console.log(`    description:  ${row.description}`);
      console.log(`    status:       ${row.status}`);
      console.log(`    updatedAt:    ${row.updatedAt.toString()}`);
      console.log(`    updatedBy:    ${row.updatedBy}`);
    }
    console.log("====================================================\n");

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      assert.equal(item.key, allKeys[i]);
      const single = await config.read.getConfig([item.key]);
      assert.equal(single.key, item.key);
      assert.equal(single.value, item.value);
      assert.equal(single.valueType, item.valueType);
      assert.equal(single.description, item.description);
      assert.equal(single.status, item.status);
      assert.equal(single.updatedAt, item.updatedAt);
      assert.equal(single.updatedBy.toLowerCase(), item.updatedBy.toLowerCase());
    }
  });
});
