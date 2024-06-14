// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library PriceConverter {

        // Returns value of 1 eth in USD and converts the result to ETH as wei before returning
    function getPrice() internal view returns (uint256) {
        /**
        * Network: Sepolia
        * Aggregator: ETH/USD
        * Address: 0x694AA1769357215DE4FAC081bf1f309aDC325306
        */
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        (
            /*uint80 roundId*/, 
            int256 answer,
            /*uint256 startedAt*/,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        // answer is price of ETH in USD
        
        return uint256(answer * 1e10); // 
    }

    function getVersion() internal view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        return priceFeed.version();
    }

    // Converts ETH (Wei) to USD and returns result in ETH as wei
    function getConversionRate(uint256 ethAmountInWei /* ETH as WEI*/) internal view returns (uint256) {
        uint256 weiInUSD = getPrice();
        uint256 weiAmountInUSD = (weiInUSD * ethAmountInWei) / 1e18;

        return weiAmountInUSD;
    }
}
