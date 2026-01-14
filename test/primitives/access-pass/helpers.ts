// test/primitives/access-pass/helpers.ts
import hre from "hardhat";
import type { EventLog, Signer } from "ethers";

export async function setupAccessPass() {
  const { ethers } = await hre.network.connect();

  const signers = await ethers.getSigners();
  const owner: Signer = signers[0];
  const other: Signer = signers[1];

  const AccessPassV1 = await ethers.getContractFactory("AccessPassV1");

  const accessPass = await AccessPassV1.deploy(
    "crontag Access Pass",
    "CRONPASS"
  );
  await accessPass.waitForDeployment();

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

    // Find the decoded AccessPassMinted event
    const event = receipt!.logs.find(
      (log): log is EventLog =>
        log instanceof ethers.EventLog &&
        log.fragment.name === "AccessPassMinted"
    );

    if (!event) {
      throw new Error("AccessPassMinted event not found");
    }

    return event.args.tokenId;
  }

  return { ethers, accessPass, owner, other, mintPass };
}
