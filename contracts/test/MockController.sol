// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title MockController
 *
 * @notice
 * Minimal declarative controller used for testing.
 * Always allows minting.
 *
 * This contract intentionally:
 * - Has no state
 * - Performs no side effects
 * - Encodes no authority beyond returning `true`
 *
 * It exists solely to validate that AccessPassV1
 * consults a controller at mint time.
 */
contract MockController {
    function canMint(address, bytes32) external pure returns (bool) {
        return true;
    }
}
