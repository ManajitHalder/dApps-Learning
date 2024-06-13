// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface InterfaceCallee {
    function someStuff(uint256 x) external pure returns (uint256);
}

contract ICallee is InterfaceCallee {
    function someStuff(uint256 x) external pure override returns (uint256) {
        unchecked {
            return x + 2;
        }
    }
}

contract InterfaceCaller {
    InterfaceCallee icallee;

    constructor(ICallee _icallee) {
        icallee = ICallee(_icallee);
    }

    function callSomeStuff(uint256 x) public view returns (uint256) {
        unchecked {
            return icallee.someStuff(x);
        }
    }
}