// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./PriceConverter.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/**
 * @notice Checks to make sure that msg.sender is owner
 * @dev This error is thorwn if withdraw function is called otherthan owner
 */
error FundMe__NotOwner();

/** @title A contract for crown funding
 *  @author Manajit Halder
 *  @notice This contract is to demo a sample crowd funding contract
 *  @dev All functions are currently implemented without side effects.
 */
contract FundMe {
    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 50 * 1e18;
    address public immutable i_owner;
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;
    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddress) {        
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    modifier onlyOwner() {
        // require(msg.sender == i_owner, "Only owner can call this function");
        if (msg.sender != i_owner) { revert FundMe__NotOwner(); }
        _;
    }

    /** @notice Receives fund when msg.data is empty
     *  @dev Called when no other function matches with contract function
     */
    receive() external payable {
        fund();
    }

    /** @notice Receives fund when msg.data is not empty
     *  @dev Called when no other function matches with contract function
     */
    fallback() external payable {
        fund();
    }

    /** @notice This function receives fund from anyone
     *  @dev Function maintain funders list
     */
    function fund() public payable {
        // Want to be able to set a minimum fund amount in USD
        // Send some ETH to this contract?
        require(msg.value.getConversionRate(priceFeed) >= MINIMUM_USD, "Didn't send enough!");
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    /** @notice Withdraw fund only by owner
     *  @dev Withdraws fund from all funders and empty their fund
     */
    function withdraw() public onlyOwner {
        for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        // reset the funders array
        funders = new address[](0);

        // // transfer
        // payable(msg.sender).transfer(address(this).balance);
        // // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "send failed");
        // call 
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "call failed");
    }
}
