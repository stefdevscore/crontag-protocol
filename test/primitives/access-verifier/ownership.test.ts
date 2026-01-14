import { expect } from "chai";
import { setupAccessVerifier } from "./helpers.js";

describe("AccessVerifierV1 — Ownership", function () {
  it("returns false when caller is not the token owner", async () => {
    const { verifier, other, mintPass, ethers } = await setupAccessVerifier();

    const contextId = ethers.keccak256(ethers.toUtf8Bytes("ownership-context"));

    const tokenId = await mintPass({
      contextId,
      tier: 1,
      transferable: true,
    });

    const allowed = await verifier.verify(
      await other.getAddress(),
      tokenId,
      contextId,
      1
    );

    expect(allowed).to.equal(false);
  });
});
