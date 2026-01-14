import { expect } from "chai";
import { setupContextController } from "./helpers.js";

describe("ContextControllerV1 — Supply Boundary", function () {
  it("allows minting up to maxSupply and rejects the next", async () => {
    const { ethers, controller, user } = await setupContextController();

    const contextId = ethers.keccak256(
      ethers.toUtf8Bytes("supply-boundary-context")
    );

    // Set maxSupply = 1
    await controller.setContextRules(contextId, 0n, 0n, 1n, false);

    // First mint allowed
    expect(
      await controller.canMint(await user.getAddress(), contextId)
    ).to.equal(true);

    await controller.recordMint(contextId);

    // Second mint rejected
    expect(
      await controller.canMint(await user.getAddress(), contextId)
    ).to.equal(false);
  });
});
