import hre from "hardhat";
import type { BaseContract } from "ethers";
import { setupAccessPass } from "../access-pass/helpers.js";

/**
 * Minimal helper for AccessVerifierV1 tests.
 *
 * Invariants:
 * - Verifier is bound to a single AccessPassV1
 * - No duplicate signer sources
 * - No silent overwrites
 * - No policy assumptions
 */
export interface AccessVerifier extends BaseContract {
  verify(
    _account: string,
    _tokenId: bigint,
    _contextId: string,
    _requiredTier: number
  ): Promise<boolean>;
}

export async function setupAccessVerifier() {
  const { ethers } = await hre.network.connect();

  // Reuse AccessPass test primitive
  const { accessPass, mintPass, owner, other } = await setupAccessPass();

  const Verifier = await ethers.getContractFactory("AccessVerifierV1");

  // IMPORTANT: bind verifier to the AccessPassV1 instance
  const verifier = (await Verifier.deploy(
    await accessPass.getAddress()
  )) as unknown as AccessVerifier;

  await verifier.waitForDeployment();

  return {
    ethers,
    verifier,
    accessPass,
    mintPass,
    owner,
    other,
  };
}
