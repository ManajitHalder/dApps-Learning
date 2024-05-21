// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// There are 3 types of variables in Solidity
// local:
//     declared inside a function
//     not stored on blockchain
// state:
//     declared outside a function
//     stored on the blockchain
// global:
//     provides information about the blockchain

contract Variables {
    // State variables
    string public txt = "Smart";
    uint public num = 32;

    // Constants are variables that cannot be modified.
    address public constant MY_ADDRESS =
        0x777788889999AaAAbBbbCcccddDdeeeEfFFfCcCc;
    uint public constant MY_UINT = 123;

    // Immutable variables:
    address public immutable ADDRESS;
    uint public immutable UNIT;

    // Immutable variables are like constants. Values of immutable variables can be set inside the constructor
    // but cannot be modified afterwards.
    constructor(uint _unit) {
        ADDRESS = msg.sender;
        UNIT = _unit;
    }

    function someFunction() public view {
        // Local variables
        uint local = 312;

        // Global variables
        uint timestamp = block.timestamp;
        address sender = msg.sender;
    }
}
