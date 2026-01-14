import { expect } from "chai";
import { setupAccessPass } from "./helpers.js";

describe("AccessPassV1 — Misuse Is Undeniable", function () {
  it("allows issuance of nonsensical values without interpretation", async () => {
    const { ethers, accessPass, mintPass } = await setupAccessPass();

    const tokenId = await mintPass({
      contextId: ethers.ZeroHash,
      expiresAt: 0n,
      tier: 0,
      transferable: false,
    });

    const data = await accessPass.passData(tokenId);

    expect(data.contextId).to.equal(ethers.ZeroHash);
    expect(data.expiresAt).to.equal(0n);
    expect(data.tier).to.equal(0);
  });
});
