// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/** @title A contract for price conversion using CCIP price feed
 *  @author Manajit Halder
 *  @notice This contract is to calculate price feed using CCIP
 *  @dev This calculates price feed
 */
library PriceConverter {

        // Returns value of 1 eth in USD and converts the result to WEI before returning
    function getPrice(AggregatorV3Interface priceFeed) internal view returns (uint256) {
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
        return AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306).version();
    }

    // Converts ETH (Wei) to USD and returns result in ETH as wei
    function getConversionRate(uint256 ethAmountInWei /* ETH as WEI*/, AggregatorV3Interface priceFeed) internal view returns (uint256) {
        uint256 weiInUSD = getPrice(priceFeed);
        uint256 weiAmountInUSD = (weiInUSD * ethAmountInWei) / 1e18;

        return weiAmountInUSD;
    }
}