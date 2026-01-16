import { expect } from "chai";
import { setupContextController } from "./helpers.js";
import type { ContextController } from "./helpers.js";

describe("ContextControllerV1 — Non-Retroactivity", function () {
  it("does not retroactively affect issuance accounting when rules change", async () => {
    const { ethers, controller, owner, user } = await setupContextController();

    const typedController = controller as unknown as ContextController;

    const controllerAsOwner = typedController.connect(
      owner
    ) as unknown as ContextController;

    const contextId = ethers.keccak256(
      ethers.toUtf8Bytes("non-retroactive-context")
    );

    // 1. Explicit context registration
    await controllerAsOwner.registerContext(
      contextId,
      await owner.getAddress()
    );

    // 2. Initially unrestricted minting
    expect(
      await typedController.canMint(await user.getAddress(), contextId)
    ).to.equal(true);

    // 3. Simulate a successful mint being recorded
    await controllerAsOwner.recordMint(contextId);

    // 4. Tighten rules AFTER issuance
    await controllerAsOwner.setContextRules(
      contextId,
      0n, // mintStart
      0n, // mintEnd
      1n, // maxSupply = 1
      false
    );

    // 5. Second mint should now be disallowed
    expect(
      await typedController.canMint(await user.getAddress(), contextId)
    ).to.equal(false);
  });
});
