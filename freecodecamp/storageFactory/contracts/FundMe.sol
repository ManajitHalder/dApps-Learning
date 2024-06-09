// Get funds from users
// Withdraw funds
// Set a minimum funding value in USD

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FuncMe {
    uint256 public minimumUSD = 50;

    function fund() public payable {
        // Send some ETH to this contract?
        require(msg.value >= minimumUSD, "Insufficient fund received");
    }

    function getPrice() public {
        // ABI
        // contract address
    }

    function withdraw() public {}
}
