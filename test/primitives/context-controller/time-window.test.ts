import { expect } from "chai";
import { setupContextController } from "./helpers.js";

describe("ContextControllerV1 — Time Window", function () {
  it("enforces mintStart and mintEnd boundaries precisely", async () => {
    const { ethers, controller, user } = await setupContextController();

    const now = BigInt((await ethers.provider.getBlock("latest"))!.timestamp);

    const mintStart = now + 10n;
    const mintEnd = now + 20n;

    const contextId = ethers.keccak256(
      ethers.toUtf8Bytes("time-window-context")
    );

    await controller.setContextRules(contextId, mintStart, mintEnd, 0n, false);

    // Before window
    expect(
      await controller.canMint(await user.getAddress(), contextId)
    ).to.equal(false);

    // Jump to start
    await ethers.provider.send("evm_setNextBlockTimestamp", [
      Number(mintStart),
    ]);
    await ethers.provider.send("evm_mine", []);

    expect(
      await controller.canMint(await user.getAddress(), contextId)
    ).to.equal(true);

    // Jump past end
    await ethers.provider.send("evm_setNextBlockTimestamp", [
      Number(mintEnd + 1n),
    ]);
    await ethers.provider.send("evm_mine", []);

    expect(
      await controller.canMint(await user.getAddress(), contextId)
    ).to.equal(false);
  });
});
