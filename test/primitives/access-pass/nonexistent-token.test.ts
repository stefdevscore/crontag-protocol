import { expect } from "chai";
import { setupAccessPass } from "./helpers.js";

describe("AccessPassV1 — Nonexistent Token", function () {
  it("reverts when querying passData for a nonexistent token", async () => {
    const { accessPass } = await setupAccessPass();

    await expect(accessPass.passData(999n)).to.be.revertedWithCustomError(
      accessPass,
      "ERC721NonexistentToken"
    );
  });
});
