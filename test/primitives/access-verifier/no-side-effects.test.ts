import { expect } from "chai";
import { setupAccessVerifier } from "./helpers.js";

describe("AccessVerifierV1 — No Side Effects", function () {
  it("does not mutate AccessPass state during verification", async () => {
    const { verifier, owner, mintPass, accessPass, ethers } =
      await setupAccessVerifier();

    const contextId = ethers.keccak256(
      ethers.toUtf8Bytes("no-side-effects-context")
    );

    const tokenId = await mintPass({
      contextId,
      expiresAt: 0n,
      tier: 1,
      transferable: true,
    });

    // Snapshot state BEFORE verification
    const ownerBefore = await accessPass.ownerOf(tokenId);
    const passDataBefore = await accessPass.passData(tokenId);

    // Perform verification
    const allowed = await verifier.verify(
      await owner.getAddress(),
      tokenId,
      contextId,
      1
    );

    expect(allowed).to.equal(true);

    // Snapshot state AFTER verification
    const ownerAfter = await accessPass.ownerOf(tokenId);
    const passDataAfter = await accessPass.passData(tokenId);

    // Ownership must be unchanged
    expect(ownerAfter).to.equal(ownerBefore);

    // Immutable pass facts must be unchanged
    expect(passDataAfter.contextId).to.equal(passDataBefore.contextId);
    expect(passDataAfter.expiresAt).to.equal(passDataBefore.expiresAt);
    expect(passDataAfter.tier).to.equal(passDataBefore.tier);
    expect(passDataAfter.transferable).to.equal(passDataBefore.transferable);
    expect(passDataAfter.controller).to.equal(passDataBefore.controller);
  });
});
