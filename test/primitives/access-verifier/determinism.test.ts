import { expect } from "chai";
import { setupAccessVerifier } from "./helpers.js";

describe("AccessVerifierV1 — Determinism", function () {
  it("returns the same result across repeated calls with identical inputs", async () => {
    const { verifier, owner, mintPass, ethers } = await setupAccessVerifier();

    const contextId = ethers.keccak256(
      ethers.toUtf8Bytes("determinism-context")
    );

    const tokenId = await mintPass({
      contextId,
      expiresAt: 0n,
      tier: 1,
      transferable: false,
    });

    const first = await verifier.verify(
      await owner.getAddress(),
      tokenId,
      contextId,
      1
    );

    const second = await verifier.verify(
      await owner.getAddress(),
      tokenId,
      contextId,
      1
    );

    const third = await verifier.verify(
      await owner.getAddress(),
      tokenId,
      contextId,
      1
    );

    expect(first).to.equal(true);
    expect(second).to.equal(true);
    expect(third).to.equal(true);
  });
});
