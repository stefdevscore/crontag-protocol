import { expect } from "chai";
import { setupAccessVerifier } from "./helpers.js";

describe("AccessVerifierV1 — Nonexistent Token", function () {
  it("returns false for a nonexistent tokenId", async () => {
    const { verifier, owner, ethers } = await setupAccessVerifier();

    const allowed = await verifier.verify(
      await owner.getAddress(),
      9999n,
      ethers.ZeroHash,
      0
    );

    expect(allowed).to.equal(false);
  });
});
