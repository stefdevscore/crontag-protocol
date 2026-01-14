import { expect } from "chai";
import { setupAccessVerifier } from "./helpers.js";

describe("AccessVerifierV1 — Tier Zero", function () {
  it("allows access when requiredTier is zero regardless of token tier", async () => {
    const { verifier, owner, mintPass, ethers } = await setupAccessVerifier();

    const contextId = ethers.keccak256(ethers.toUtf8Bytes("tier-zero-context"));

    // Mint a token with tier = 0
    const tokenId = await mintPass({
      contextId,
      tier: 0,
      expiresAt: 0n,
      transferable: false,
    });

    // requiredTier = 0 should always pass
    const allowed = await verifier.verify(
      await owner.getAddress(),
      tokenId,
      contextId,
      0
    );

    expect(allowed).to.equal(true);
  });
});
