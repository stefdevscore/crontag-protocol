import { expect } from "chai";
import { setupAccessPass } from "./helpers.js";

describe("AccessPassV1 — Controller Scope", function () {
  it("consults controller at mint time only", async () => {
    const { ethers, accessPass, owner, other, mintPass } =
      await setupAccessPass();

    const Controller = await ethers.getContractFactory("MockController");
    const controller = await Controller.deploy();
    await controller.waitForDeployment();

    const tokenId = await mintPass({
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

  it("reverts mint if controller rejects", async () => {
    const { ethers, mintPass, accessPass } = await setupAccessPass();

    const Controller = await ethers.getContractFactory("RejectingController");
    const controller = await Controller.deploy();
    await controller.waitForDeployment();

    await expect(
      mintPass({
        controller: await controller.getAddress(),
      })
    ).to.be.revertedWithCustomError(accessPass, "ControllerRejected");
  });
});
