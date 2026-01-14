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
  canMint(_minter: string, _contextId: string): Promise<boolean>;

  setContextRules(
    _contextId: string,
    _mintStart: bigint,
    _mintEnd: bigint,
    _maxSupply: bigint,
    _useAllowlist: boolean
  ): Promise<void>;

  setAllowlist(
    _contextId: string,
    _minter: string,
    _allowed: boolean
  ): Promise<void>;

  recordMint(_contextId: string): Promise<void>;
}

export async function setupContextController() {
  const { ethers } = await hre.network.connect();
  const signers = await ethers.getSigners();

  const owner: Signer = signers[0];
  const user: Signer = signers[1];

  const Controller = await ethers.getContractFactory("ContextControllerV1");

  const controller = (await Controller.deploy(
    await owner.getAddress()
  )) as unknown as ContextController;

  await controller.waitForDeployment();

  return {
    ethers,
    controller,
    owner,
    user,
  };
}
