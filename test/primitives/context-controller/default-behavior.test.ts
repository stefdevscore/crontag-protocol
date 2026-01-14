import { expect } from "chai";
import { setupContextController } from "./helpers.js";
import type { ContextController } from "./helpers.js";

describe("ContextControllerV1 — Default Behavior", function () {
  it("allows minting for a registered context when no rules are configured", async () => {
    const { ethers, controller, owner, user } = await setupContextController();

    const typedController = controller as unknown as ContextController;

    const controllerAsOwner = typedController.connect(
      owner
    ) as unknown as ContextController;

    const contextId = ethers.keccak256(ethers.toUtf8Bytes("default-context"));

    // ✅ Explicit registration
    await controllerAsOwner.registerContext(contextId);

    const allowed = await typedController.canMint(
      await user.getAddress(),
      contextId
    );

    expect(allowed).to.equal(true);
  });
});
