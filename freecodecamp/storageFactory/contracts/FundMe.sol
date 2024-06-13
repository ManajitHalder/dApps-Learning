// Get funds from users
// Withdraw funds
// Set a minimum funding value in USD

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract FundMe {
    uint256 public constant MINIMUM_USD = 50;
    AggregatorV3Interface internal priceFeed;

    constructor() {

        priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
    }

    function fund() public payable {
        // Want to be able to set a minimum fund amount in USD
        // Send some ETH to this contract?
        require(msg.value >= 1e18, "Didn't send enough!");
    }

    // Since getPrice will get the price from contract outside of this contract, we are going to need
    // ABI and address of the external contract to interact with it.
    function getPrice() public {
        // ABI
        // contract address 0x694AA1769357215DE4FAC081bf1f309aDC325306
        (, int256 answer, , , ) = priceFeed.getRoundData();
    }

    function getConversionRate() public {}

    function withdraw() public {}
}
