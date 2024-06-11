// Get funds from users
// Withdraw funds
// Set a minimum funding value in USD

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FundMe {
    uint256 public constant MINIMUM_USD = 50;

    function fund() public payable {
        // Want to be able to set a minimum fund amount in USD
        // Send some ETH to this contract?
        require(msg.value >= 1e18, "Didn't send enough!");
    }

    // Since getPrice will get the price from contract outside of this contract, we are going to need
    // ABI and address of the external contract to interact with it.
    function getPrice() public {
        // ABI
        // contract address
    }

    function withdraw() public {}
}
