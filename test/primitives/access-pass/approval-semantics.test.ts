import { expect } from "chai";
import { setupAccessPass } from "./helpers.js";

describe("AccessPassV1 — Approval Semantics", function () {
  it("always disables approvals", async () => {
    const { accessPass, other, mintPass } = await setupAccessPass();

    const tokenId = await mintPass({ transferable: true });

    await expect(
      accessPass.approve(await other.getAddress(), tokenId)
    ).to.be.revertedWithCustomError(accessPass, "ApprovalsDisabled");

    await expect(
      accessPass.setApprovalForAll(await other.getAddress(), true)
    ).to.be.revertedWithCustomError(accessPass, "ApprovalsDisabled");
  });
});
