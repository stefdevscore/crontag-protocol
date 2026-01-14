import { expect } from "chai";
import { setupContextController } from "./helpers.js";

describe("ContextControllerV1 — Allowlist Semantics", function () {
  it("enforces allowlist only when enabled", async () => {
    const { ethers, controller, user } = await setupContextController();

    const contextId = ethers.keccak256(ethers.toUtf8Bytes("allowlist-context"));

    // Allowlist disabled → mint allowed
    await controller.setContextRules(contextId, 0n, 0n, 0n, false);

    expect(
      await controller.canMint(await user.getAddress(), contextId)
    ).to.equal(true);

    // Enable allowlist
    await controller.setContextRules(contextId, 0n, 0n, 0n, true);

    // Not allowlisted → rejected
    expect(
      await controller.canMint(await user.getAddress(), contextId)
    ).to.equal(false);

    // Add to allowlist
    await controller.setAllowlist(contextId, await user.getAddress(), true);

    expect(
      await controller.canMint(await user.getAddress(), contextId)
    ).to.equal(true);
  });
});
