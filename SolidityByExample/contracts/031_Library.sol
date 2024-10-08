// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library MathAddSub {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        unchecked {
            return a + b;
        }
    }

    function subtract(uint256 a, uint256 b) internal pure returns (uint256) {
        require(a >= b, "Subraction overflow");
        unchecked {
            return a - b;           
        }
    }
}
