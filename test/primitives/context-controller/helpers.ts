import hre from "hardhat";
import type { BaseContract, Signer } from "ethers";

/**
 * Minimal deployment helper for ContextControllerV1.
 *
 * IMPORTANT:
 * - This helper does NOT encode policy.
 * - Tests must configure rules explicitly.
 * - Types mirror Solidity exactly (uint64 → bigint).
 */
export interface ContextController extends BaseContract {
  // NEW — Model C requires explicit registration
  registerContext(contextId: string): Promise<void>;

  canMint(minter: string, contextId: string): Promise<boolean>;

  setContextRules(
    contextId: string,
    mintStart: bigint,
    mintEnd: bigint,
    maxSupply: bigint,
    useAllowlist: boolean
  ): Promise<void>;

  setAllowlist(
    contextId: string,
    minter: string,
    allowed: boolean
  ): Promise<void>;

  recordMint(contextId: string): Promise<void>;
}

export async function setupContextController() {
  const { ethers } = await hre.network.connect();
  const signers = await ethers.getSigners();

  const owner: Signer = signers[0];
  const user: Signer = signers[1];

  const Controller = await ethers.getContractFactory("ContextControllerV1");

  const controller =
    (await Controller.deploy()) as unknown as ContextController;

  await controller.waitForDeployment();

  return {
    ethers,
    controller,
    owner,
    user,
  };
}
