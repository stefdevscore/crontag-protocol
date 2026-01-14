import { expect } from "chai";
import { setupContextController } from "./helpers.js";

describe("ContextControllerV1 — Declarative Semantics", function () {
  it("does not mutate state when canMint is called", async () => {
    const { ethers, controller, user } = await setupContextController();

    const contextId = ethers.keccak256(
      ethers.toUtf8Bytes("declarative-context")
    );

    // Context is NOT registered — under Model C this MUST return false
    const first = await controller.canMint(await user.getAddress(), contextId);

    const second = await controller.canMint(await user.getAddress(), contextId);

    // Deterministic
    expect(first).to.equal(false);
    expect(second).to.equal(false);
  });
});
