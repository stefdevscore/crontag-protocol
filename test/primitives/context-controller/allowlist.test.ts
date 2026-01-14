import { expect } from "chai";
import { setupContextController } from "./helpers.js";
import type { ContextController } from "./helpers.js";

describe("ContextControllerV1 — Allowlist Semantics", function () {
  it("enforces allowlist only when enabled", async () => {
    const { ethers, controller, owner, user } = await setupContextController();

    const contextId = ethers.keccak256(ethers.toUtf8Bytes("allowlist-context"));

    const ownerController = controller.connect(
      owner
    ) as unknown as ContextController;

    // ✅ Explicit context registration
    await ownerController.registerContext(contextId);

    // Allowlist disabled → mint allowed
    await ownerController.setContextRules(contextId, 0n, 0n, 0n, false);

    expect(
      await controller.canMint(await user.getAddress(), contextId)
    ).to.equal(true);

    // Enable allowlist
    await ownerController.setContextRules(contextId, 0n, 0n, 0n, true);

    // Not allowlisted → rejected
    expect(
      await controller.canMint(await user.getAddress(), contextId)
    ).to.equal(false);

    // Add to allowlist
    await ownerController.setAllowlist(
      contextId,
      await user.getAddress(),
      true
    );

    expect(
      await controller.canMint(await user.getAddress(), contextId)
    ).to.equal(true);
  });
});
