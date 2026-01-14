import { expect } from "chai";
import { setupAccessVerifier } from "./helpers.js";

describe("AccessVerifierV1 — Allow Path", function () {
  it("returns true when all explicit requirements are satisfied", async () => {
    const { verifier, owner, mintPass, ethers } = await setupAccessVerifier();

    const contextId = ethers.keccak256(
      ethers.toUtf8Bytes("allow-path-context")
    );

    const tokenId = await mintPass({
      contextId,
      expiresAt: 0n, // no expiry
      tier: 2,
      transferable: false,
    });

    const allowed = await verifier.verify(
      await owner.getAddress(),
      tokenId,
      contextId,
      1 // requiredTier <= token tier
    );

    expect(allowed).to.equal(true);
  });
});
