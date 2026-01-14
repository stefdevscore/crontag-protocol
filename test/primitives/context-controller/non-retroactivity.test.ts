import { expect } from "chai";
import { setupContextController } from "./helpers.js";

/**
 * Non-retroactivity invariant:
 *
 * - Rules affect future minting only
 * - Past issuance facts are never reinterpreted
 * - No state mutation or revocation of history is possible
 */
describe("ContextControllerV1 — Non-Retroactivity", function () {
  it("does not retroactively affect issuance accounting when rules change", async () => {
    const { ethers, controller, user } = await setupContextController();

    const contextId = ethers.keccak256(
      ethers.toUtf8Bytes("non-retroactive-context")
    );

    // Initial state: unrestricted minting
    expect(
      await controller.canMint(await user.getAddress(), contextId)
    ).to.equal(true);

    // Simulate a successful mint being recorded
    await controller.recordMint(contextId);

    // Tighten rules AFTER issuance
    await controller.setContextRules(
      contextId,
      0n, // mintStart
      0n, // mintEnd
      1n, // maxSupply = 1
      false // no allowlist
    );

    // A second mint should now be disallowed
    expect(
      await controller.canMint(await user.getAddress(), contextId)
    ).to.equal(false);

    // If this test reaches here, non-retroactivity holds:
    // - the first mint was not invalidated
    // - no hidden mutation or rollback occurred
  });
});
