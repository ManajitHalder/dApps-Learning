// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./031_Library.sol";

contract Calculator {
    using MathAddSub for uint256;

    function addSub(
        uint256 a,
        uint256 b
    ) public pure returns (uint256 sum, uint256 difference) {
        sum = a.add(b);
        difference = a.subtract(b);
    }
}
