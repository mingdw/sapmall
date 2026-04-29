import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("SAPToken", async function () {
  const { viem } = await network.create();
  const [admin, user] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  async function waitForTx(hash: `0x${string}`) {
    await publicClient.waitForTransactionReceipt({ hash });
  }

  it("initializes with roles and bucket configs", async function () {
    const token = await viem.deployContract("SAPToken");
    const tx = await admin.writeContract({
      address: token.address,
      abi: token.abi,
      functionName: "initialize",
      args: ["Sapphire Mall Token", "SAP", admin.account.address],
    });
    await waitForTx(tx);

    const pauserRole = await token.read.PAUSER_ROLE();
    const hasPauserRole = await token.read.hasRole([pauserRole, admin.account.address]);
    assert.equal(hasPauserRole, true);

    const max = await token.read.MAX_SUPPLY();
    assert.equal(max, 1_000_000_000n * 10n ** 18n);
    assert.equal(await token.read.totalSupply(), 0n);
  });

  it("allows ecosystem TGE mint and blocks team immediate mint", async function () {
    const token = await viem.deployContract("SAPToken");
    const initTx = await admin.writeContract({
      address: token.address,
      abi: token.abi,
      functionName: "initialize",
      args: ["Sapphire Mall Token", "SAP", admin.account.address],
    });
    await waitForTx(initTx);

    const ecosystemBucket = await token.read.BUCKET_ECOSYSTEM_FUND();
    const teamBucket = await token.read.BUCKET_TEAM();

    const tgeMint = 20_000_000n * 10n ** 18n;
    const mintTx = await admin.writeContract({
      address: token.address,
      abi: token.abi,
      functionName: "mintFromBucket",
      args: [ecosystemBucket, user.account.address, tgeMint],
    });
    await waitForTx(mintTx);
    assert.equal(await token.read.balanceOf([user.account.address]), tgeMint);

    await assert.rejects(async () => admin.writeContract({
      address: token.address,
      abi: token.abi,
      functionName: "mintFromBucket",
      args: [teamBucket, user.account.address, 1n * 10n ** 18n],
    }));
  });

  it("pauses transfers", async function () {
    const token = await viem.deployContract("SAPToken");
    const initTx = await admin.writeContract({
      address: token.address,
      abi: token.abi,
      functionName: "initialize",
      args: ["Sapphire Mall Token", "SAP", admin.account.address],
    });
    await waitForTx(initTx);

    const ecosystemBucket = await token.read.BUCKET_ECOSYSTEM_FUND();
    const mintTx = await admin.writeContract({
      address: token.address,
      abi: token.abi,
      functionName: "mintFromBucket",
      args: [ecosystemBucket, admin.account.address, 1000n * 10n ** 18n],
    });
    await waitForTx(mintTx);

    const pauseTx = await admin.writeContract({
      address: token.address,
      abi: token.abi,
      functionName: "pause",
      args: [],
    });
    await waitForTx(pauseTx);

    await assert.rejects(async () => admin.writeContract({
      address: token.address,
      abi: token.abi,
      functionName: "transfer",
      args: [user.account.address, 1n * 10n ** 18n],
    }));
  });

  it("mints for exchange from community bucket", async function () {
    const token = await viem.deployContract("SAPToken");
    const initTx = await admin.writeContract({
      address: token.address,
      abi: token.abi,
      functionName: "initialize",
      args: ["Sapphire Mall Token", "SAP", admin.account.address],
    });
    await waitForTx(initTx);

    const amount = 1_000_000n * 10n ** 18n;
    const exchangeTx = await admin.writeContract({
      address: token.address,
      abi: token.abi,
      functionName: "mintForExchange",
      args: [user.account.address, amount],
    });
    await waitForTx(exchangeTx);

    assert.equal(await token.read.exchangeMinted(), amount);
    assert.equal(await token.read.balanceOf([user.account.address]), amount);
  });

  it("blocks exchange mint for non-exchange role", async function () {
    const token = await viem.deployContract("SAPToken");
    const initTx = await admin.writeContract({
      address: token.address,
      abi: token.abi,
      functionName: "initialize",
      args: ["Sapphire Mall Token", "SAP", admin.account.address],
    });
    await waitForTx(initTx);

    await assert.rejects(async () => user.writeContract({
      address: token.address,
      abi: token.abi,
      functionName: "mintForExchange",
      args: [user.account.address, 1n * 10n ** 18n],
    }));
  });

  it("enforces exchange cap", async function () {
    const token = await viem.deployContract("SAPToken");
    const initTx = await admin.writeContract({
      address: token.address,
      abi: token.abi,
      functionName: "initialize",
      args: ["Sapphire Mall Token", "SAP", admin.account.address],
    });
    await waitForTx(initTx);

    const exchangeCap = (await token.read.EXCHANGE_COMMUNITY_CAP()) as bigint;
    const firstMint = 200_000_000n * 10n ** 18n;
    const secondMint = exchangeCap - firstMint;

    const tx1 = await admin.writeContract({
      address: token.address,
      abi: token.abi,
      functionName: "mintForExchange",
      args: [admin.account.address, firstMint],
    });
    await waitForTx(tx1);

    const tx2 = await admin.writeContract({
      address: token.address,
      abi: token.abi,
      functionName: "mintForExchange",
      args: [admin.account.address, secondMint],
    });
    await waitForTx(tx2);

    assert.equal(await token.read.exchangeMinted(), exchangeCap);
    assert.equal(await token.read.getExchangeRemaining(), 0n);

    await assert.rejects(async () => admin.writeContract({
      address: token.address,
      abi: token.abi,
      functionName: "mintForExchange",
      args: [admin.account.address, 1n],
    }));
  });
});
