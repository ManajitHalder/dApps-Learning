// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

contract Basic {
    uint public number;

    function setNumber(uint _number) public {
        number = _number;
    }
}
