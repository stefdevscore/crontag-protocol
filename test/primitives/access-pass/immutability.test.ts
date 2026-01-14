import { expect } from "chai";
import { setupAccessPass } from "./helpers.js";

describe("AccessPassV1 — Immutability", function () {
  it("writes immutable pass data at mint time", async () => {
    const { ethers, accessPass, mintPass } = await setupAccessPass();

    const contextId = ethers.keccak256(ethers.toUtf8Bytes("immutable-context"));

    const tokenId = await mintPass({
      contextId,
      expiresAt: 123n,
      tier: 7,
      transferable: false,
    });

    const data = await accessPass.passData(tokenId);

    expect(data.contextId).to.equal(contextId);
    expect(data.expiresAt).to.equal(123n);
    expect(data.tier).to.equal(7);
    expect(data.transferable).to.equal(false);
    expect(data.controller).to.equal(ethers.ZeroAddress);
  });
});
