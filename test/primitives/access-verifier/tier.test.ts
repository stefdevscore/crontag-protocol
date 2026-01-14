import { expect } from "chai";
import { setupAccessVerifier } from "./helpers.js";

describe("AccessVerifierV1 — Tier Requirement", function () {
  it("returns false when token tier is below required tier", async () => {
    const { verifier, owner, mintPass, ethers } = await setupAccessVerifier();

    const contextId = ethers.keccak256(ethers.toUtf8Bytes("tier-context"));

    const tokenId = await mintPass({
      contextId,
      tier: 1,
      transferable: false,
    });

    const allowed = await verifier.verify(
      await owner.getAddress(),
      tokenId,
      contextId,
      2
    );

    expect(allowed).to.equal(false);
  });
});
