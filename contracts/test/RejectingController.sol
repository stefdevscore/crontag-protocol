// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract RejectingController {
    function canMint(address, bytes32) external pure returns (bool) {
        return false;
    }
}
