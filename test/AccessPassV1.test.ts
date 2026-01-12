import hre from "hardhat";
import { expect } from "chai";
import type { Contract, Signer } from "ethers";

/**
 * Invariant-driven tests for AccessPassV1.
 * All interactions go through a network-bound ethers instance.
 */

describe("AccessPassV1 — Invariants", function () {
  let ethers: any;
  let accessPass: Contract;
  let owner: Signer;
  let other: Signer;

  beforeEach(async () => {
    // Explicitly connect to the Hardhat network (Hardhat v3 requirement)
    ({ ethers } = await hre.network.connect());

    const signers = await ethers.getSigners();
    owner = signers[0];
    other = signers[1];

    const AccessPassV1 = await ethers.getContractFactory("AccessPassV1");
    accessPass = await AccessPassV1.deploy("crontag Access Pass", "CRONPASS");
    await accessPass.waitForDeployment();
  });

  /* ---------------------------------------------------------------------
   * Helpers
   * ------------------------------------------------------------------ */

  async function mintPass(
    opts?: Partial<{
      contextId: string;
      expiresAt: bigint;
      tier: number;
      transferable: boolean;
      controller: string;
    }>
  ): Promise<bigint> {
    const tx = await accessPass.mint(
      opts?.contextId ?? ethers.keccak256(ethers.toUtf8Bytes("test-context")),
      opts?.expiresAt ?? 0n,
      opts?.tier ?? 0,
      opts?.transferable ?? false,
      opts?.controller ?? ethers.ZeroAddress
    );

    const receipt = await tx.wait();
    const event = receipt!.logs.find(
      (l: any) => l.fragment?.name === "AccessPassMinted"
    );

    return event!.args.tokenId;
  }

  /* ---------------------------------------------------------------------
   * Immutability
   * ------------------------------------------------------------------ */

  it("writes immutable pass data at mint time", async () => {
    const contextId = ethers.keccak256(ethers.toUtf8Bytes("immutable-context"));

    const tokenId = await mintPass({
      contextId,
      expiresAt: 123n,
      tier: 7,
      transferable: false,
    });

    const data = await accessPass.passData(tokenId);

    expect(data.contextId).to.equal(contextId);
    expect(data.expiresAt).to.equal(123n);
    expect(data.tier).to.equal(7);
    expect(data.transferable).to.equal(false);
    expect(data.controller).to.equal(ethers.ZeroAddress);
  });

  /* ---------------------------------------------------------------------
   * Transfer Semantics
   * ------------------------------------------------------------------ */

  it("reverts all transfers for non-transferable passes", async () => {
    const tokenId = await mintPass({ transferable: false });

    await expect(
      accessPass.transferFrom(
        await owner.getAddress(),
        await other.getAddress(),
        tokenId
      )
    ).to.be.revertedWithCustomError(accessPass, "NonTransferable");
  });

  it("allows transfer only when transferable = true", async () => {
    const tokenId = await mintPass({ transferable: true });

    await accessPass.transferFrom(
      await owner.getAddress(),
      await other.getAddress(),
      tokenId
    );

    expect(await accessPass.ownerOf(tokenId)).to.equal(
      await other.getAddress()
    );
  });

  /* ---------------------------------------------------------------------
   * Approval Semantics
   * ------------------------------------------------------------------ */

  it("always disables approvals", async () => {
    const tokenId = await mintPass({ transferable: true });

    await expect(
      accessPass.approve(await other.getAddress(), tokenId)
    ).to.be.revertedWithCustomError(accessPass, "ApprovalsDisabled");

    await expect(
      accessPass.setApprovalForAll(await other.getAddress(), true)
    ).to.be.revertedWithCustomError(accessPass, "ApprovalsDisabled");
  });

  /* ---------------------------------------------------------------------
   * Controller Scope
   * ------------------------------------------------------------------ */

  it("consults controller exactly once at mint time", async () => {
    const Controller = await ethers.getContractFactory("MockController");

    const controller = await Controller.deploy();
    await controller.waitForDeployment();

    const tokenId = await mintPass({
      controller: await controller.getAddress(),
      transferable: true,
    });

    expect(await controller.calls()).to.equal(1n);

    await accessPass.transferFrom(
      await owner.getAddress(),
      await other.getAddress(),
      tokenId
    );

    // No further calls after mint
    expect(await controller.calls()).to.equal(1n);
  });

  it("reverts mint if controller rejects", async () => {
    const Controller = await ethers.getContractFactory("RejectingController");

    const controller = await Controller.deploy();
    await controller.waitForDeployment();

    await expect(
      mintPass({
        controller: await controller.getAddress(),
      })
    ).to.be.revertedWithCustomError(accessPass, "ControllerRejected");
  });

  /* ---------------------------------------------------------------------
   * Misuse Is Undeniable
   * ------------------------------------------------------------------ */

  it("allows issuance of nonsensical values without interpretation", async () => {
    const tokenId = await mintPass({
      contextId: ethers.ZeroHash,
      expiresAt: 0n,
      tier: 0,
      transferable: false,
    });

    const data = await accessPass.passData(tokenId);

    expect(data.contextId).to.equal(ethers.ZeroHash);
    expect(data.expiresAt).to.equal(0n);
    expect(data.tier).to.equal(0);
  });
});
