import { expect } from "chai";
import { setupAccessPass } from "./helpers.js";

describe("AccessPassV1 — Transfer Semantics", function () {
  it("reverts all transfers for non-transferable passes", async () => {
    const { accessPass, owner, other, mintPass } = await setupAccessPass();

    const tokenId = await mintPass({ transferable: false });

    await expect(
      accessPass.transferFrom(
        await owner.getAddress(),
        await other.getAddress(),
        tokenId
      )
    ).to.be.revertedWithCustomError(accessPass, "NonTransferable");
  });

  it("allows transfer only when transferable = true", async () => {
    const { accessPass, owner, other, mintPass } = await setupAccessPass();

    const tokenId = await mintPass({ transferable: true });

    await accessPass.transferFrom(
      await owner.getAddress(),
      await other.getAddress(),
      tokenId
    );

    expect(await accessPass.ownerOf(tokenId)).to.equal(
      await other.getAddress()
    );
  });
});
