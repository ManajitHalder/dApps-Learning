// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IfElse {
    function ifelse(uint x) public pure returns (uint) {
        if (x < 10) {
            return 0;
        } else if (x < 20) {
            return 1;
        } else {
            return 2;
        }
    }

    function ternary(uint x) public pure returns (uint) {
        return x < 10 ? 1 : 2;
    }
}
