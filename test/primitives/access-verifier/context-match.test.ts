import { expect } from "chai";
import { setupAccessVerifier } from "./helpers.js";

describe("AccessVerifierV1 — Context Match", function () {
  it("returns false when contextId does not match", async () => {
    const { verifier, owner, mintPass, ethers } = await setupAccessVerifier();

    const correctContext = ethers.keccak256(
      ethers.toUtf8Bytes("correct-context")
    );

    const wrongContext = ethers.keccak256(ethers.toUtf8Bytes("wrong-context"));

    const tokenId = await mintPass({
      contextId: correctContext,
      tier: 1,
      transferable: false,
    });

    const allowed = await verifier.verify(
      await owner.getAddress(),
      tokenId,
      wrongContext,
      1
    );

    expect(allowed).to.equal(false);
  });
});
