import type { BaseContract } from "ethers";
import { setupAccessPass } from "../access-pass/helpers.js";

/**
 * Minimal helper for AccessVerifierV1 tests.
 *
 * Invariants:
 * - Single Hardhat network connection
 * - Single signer universe
 * - Verifier bound to one AccessPassV1
 * - No ambient authority
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
  // IMPORTANT:
  // Reuse AccessPass setup as the *only* network + signer source
  const { ethers, accessPass, mintPass, owner, other } =
    await setupAccessPass();

  const Verifier = await ethers.getContractFactory("AccessVerifierV1");

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
