// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MockController {
    uint256 public calls = 0;

    function canMint(address, bytes32) external returns (bool) {
        calls++;
        return true;
    }
}
