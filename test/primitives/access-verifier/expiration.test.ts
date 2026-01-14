import { expect } from "chai";
import { setupAccessVerifier } from "./helpers.js";

describe("AccessVerifierV1 — Expiration", function () {
  it("returns false when token is expired", async () => {
    const { verifier, owner, mintPass, ethers } = await setupAccessVerifier();

    const contextId = ethers.keccak256(
      ethers.toUtf8Bytes("expiration-context")
    );

    const now = BigInt(Math.floor(Date.now() / 1000));

    const tokenId = await mintPass({
      contextId,
      expiresAt: now - 1n,
      tier: 1,
      transferable: false,
    });

    const allowed = await verifier.verify(
      await owner.getAddress(),
      tokenId,
      contextId,
      1
    );

    expect(allowed).to.equal(false);
  });
});
