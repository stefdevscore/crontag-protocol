import { expect } from "chai";
import { setupContextController } from "./helpers.js";
import type { ContextController } from "./helpers.js";

describe("ContextControllerV1 — Time Window", function () {
  it("enforces mintStart and mintEnd boundaries precisely", async () => {
    const { ethers, controller, owner, user } = await setupContextController();

    const typedController = controller as unknown as ContextController;

    const controllerAsOwner = typedController.connect(
      owner
    ) as unknown as ContextController;

    const now = BigInt((await ethers.provider.getBlock("latest"))!.timestamp);

    const mintStart = now + 10n;
    const mintEnd = now + 20n;

    const contextId = ethers.keccak256(
      ethers.toUtf8Bytes("time-window-context")
    );

    // 1. Register context
    await controllerAsOwner.registerContext(contextId);

    // 2. Configure window
    await controllerAsOwner.setContextRules(
      contextId,
      mintStart,
      mintEnd,
      0n, // unlimited supply
      false // no allowlist
    );

    // 3. Before window → rejected
    expect(
      await typedController.canMint(await user.getAddress(), contextId)
    ).to.equal(false);

    // 4. Jump to mintStart
    await ethers.provider.send("evm_setNextBlockTimestamp", [
      Number(mintStart),
    ]);
    await ethers.provider.send("evm_mine", []);

    expect(
      await typedController.canMint(await user.getAddress(), contextId)
    ).to.equal(true);

    // 5. Jump past mintEnd
    await ethers.provider.send("evm_setNextBlockTimestamp", [
      Number(mintEnd + 1n),
    ]);
    await ethers.provider.send("evm_mine", []);

    expect(
      await typedController.canMint(await user.getAddress(), contextId)
    ).to.equal(false);
  });
});
