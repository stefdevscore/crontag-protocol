import { expect } from "chai";
import { setupContextController } from "./helpers.js";
import type { ContextController } from "./helpers.js";

describe("ContextControllerV1 — Supply Boundary", function () {
  it("allows minting up to maxSupply and rejects the next", async () => {
    const { ethers, controller, owner, user } = await setupContextController();

    const typedController = controller as unknown as ContextController;

    const controllerAsOwner = typedController.connect(
      owner
    ) as unknown as ContextController;

    const contextId = ethers.keccak256(
      ethers.toUtf8Bytes("supply-boundary-context")
    );

    // 1. Register context
    await controllerAsOwner.registerContext(
      contextId,
      await owner.getAddress()
    );

    // 2. Set maxSupply = 1
    await controllerAsOwner.setContextRules(
      contextId,
      0n, // mintStart
      0n, // mintEnd
      1n, // maxSupply
      false
    );

    // 3. First mint allowed
    expect(
      await typedController.canMint(await user.getAddress(), contextId)
    ).to.equal(true);

    // 4. Record first mint
    await controllerAsOwner.recordMint(contextId);

    // 5. Second mint rejected
    expect(
      await typedController.canMint(await user.getAddress(), contextId)
    ).to.equal(false);
  });
});
