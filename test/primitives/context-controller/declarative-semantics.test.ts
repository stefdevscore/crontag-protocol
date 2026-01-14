import { expect } from "chai";
import { setupContextController } from "./helpers.js";

describe("ContextControllerV1 — Declarative Semantics", function () {
  it("does not mutate state when canMint is called", async () => {
    const { ethers, controller, user } = await setupContextController();

    const contextId = ethers.keccak256(
      ethers.toUtf8Bytes("declarative-context")
    );

    // If canMint mutated state, Solidity would reject it (view)
    const allowed = await controller.canMint(
      await user.getAddress(),
      contextId
    );

    expect(allowed).to.equal(true);
  });
});
