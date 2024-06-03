// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Overflow and underflow of numbers in Solidity 0.8 throw an error. This can be disabled by using unchecked.
// Disabling overflow / underflow check saves gas.

contract UncheckedMath {
    function add(uint256 x, uint256 y) external pure returns (uint256) {
        // execution cost 927 gas
        // return x + y;

        // execution cost 748 gas
        unchecked {
            return x + y;
        }
    }

    function sub(uint256 x, uint256 y) external pure returns (uint256) {
        // execution cost 971 gas
        // return x - y;

        // execution cost 792 gas
        unchecked {
            return x - y;
        }
    }

    function sumOfCubes(uint256 x, uint256 y) external pure returns (uint256) {
        // execution cost 1966 gas
        // uint256 x3 = x * x * x;
        // uint256 y3 = y * y * y;

        // return x3 + y3;

        // execution cost 827 gas
        unchecked {
            uint256 x3 = x * x * x;
            uint256 y3 = y * y * y;

            return x3 + y3;
        }
    }
}
