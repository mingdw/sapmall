import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";
import { zeroAddress } from "viem";

describe("SAPToken", async function () {
  const { viem } = await network.create();
  const [holder] = await viem.getWalletClients();

  it("reverts when initial holder is zero address", async function () {
    await assert.rejects(async () => viem.deployContract("SAPToken", [zeroAddress]));
  });

  it("mints full supply to initial holder", async function () {
    const recipient = holder.account.address;
    const token = await viem.deployContract("SAPToken", [recipient]);

    const max = await token.read.MAX_SUPPLY();
    assert.equal(await token.read.balanceOf([recipient]), max);
    assert.equal(await token.read.totalSupply(), max);
    assert.equal(await token.read.name(), "Sapphire Mall Token");
    assert.equal(await token.read.symbol(), "SAP");
  });

  it("allows transfer between accounts", async function () {
    const [a, b] = await viem.getWalletClients();
    const token = await viem.deployContract("SAPToken", [a.account.address]);
    const amount = 1_000n * 10n ** 18n;

    const hash = await a.writeContract({
      address: token.address,
      abi: token.abi,
      functionName: "transfer",
      args: [b.account.address, amount],
    });
    await viem.assertions.transactionSucceeded(hash);

    assert.equal(await token.read.balanceOf([b.account.address]), amount);
  });
});
