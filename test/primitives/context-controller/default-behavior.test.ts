import { expect } from "chai";
import { setupContextController } from "./helpers.js";

describe("ContextControllerV1 — Default Behavior", function () {
  it("allows minting when no rules are configured", async () => {
    const { ethers, controller, user } = await setupContextController();

    const contextId = ethers.keccak256(ethers.toUtf8Bytes("default-context"));

    expect(
      await controller.canMint(await user.getAddress(), contextId)
    ).to.equal(true);
  });
});
