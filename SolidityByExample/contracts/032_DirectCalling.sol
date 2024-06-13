// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DirectCallee {
    function direct(uint256 num) public pure returns (uint256) {
        unchecked {
            return num * num;
        }
    }
}

contract DirectCaller {
    DirectCallee directCallee;

    constructor(address _directCallee) {
        // Converts the address _directCallee into a DirectCallee contract instance
        // to call functions on the DirectCallee contract.
        directCallee = DirectCallee(_directCallee);
    }

    function callDirectFunc(uint256 n) public view returns (uint256) {
        return directCallee.direct(n);
    }
}
