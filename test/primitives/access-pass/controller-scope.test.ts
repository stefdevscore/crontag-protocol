import { expect } from "chai";
import { setupAccessPass } from "./helpers.js";

describe("AccessPassV1 — Controller Scope", function () {
  it("consults controller at mint time only", async () => {
    const { ethers, accessPass, owner, other, mintPass } =
      await setupAccessPass();

    // Deploy real ContextControllerV1
    const Controller = await ethers.getContractFactory("ContextControllerV1");
    const controller = await Controller.deploy(await owner.getAddress());
    await controller.waitForDeployment();

    const contextId = ethers.keccak256(
      ethers.toUtf8Bytes("controller-scope-context")
    );

    // No rules → mint allowed
    const tokenId = await mintPass({
      contextId,
      controller: await controller.getAddress(),
      transferable: true,
    });

    // Transfer must NOT consult controller again
    await accessPass.transferFrom(
      await owner.getAddress(),
      await other.getAddress(),
      tokenId
    );

    expect(await accessPass.ownerOf(tokenId)).to.equal(
      await other.getAddress()
    );
  });

  it("reverts mint if controller disallows minting", async () => {
    const { ethers, mintPass, accessPass, owner } = await setupAccessPass();

    // Deploy real ContextControllerV1
    const Controller = await ethers.getContractFactory("ContextControllerV1");
    const controller = await Controller.deploy(await owner.getAddress());
    await controller.waitForDeployment();

    const contextId = ethers.keccak256(
      ethers.toUtf8Bytes("controller-reject-context")
    );

    // Configure controller to disallow minting:
    // enable allowlist but do not allow the minter
    await controller.setContextRules(
      contextId,
      0n, // mintStart
      0n, // mintEnd
      0n, // unlimited supply
      true // useAllowlist = true
    );

    await expect(
      mintPass({
        contextId,
        controller: await controller.getAddress(),
      })
    ).to.be.revertedWithCustomError(accessPass, "ControllerRejected");
  });
});
