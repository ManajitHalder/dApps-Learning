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
    address private immutable i_owner;
    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmountFunded;
    AggregatorV3Interface private s_priceFeed;

    constructor(address priceFeedAddress) {        
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    modifier onlyOwner() {
        // require(msg.sender == i_owner, "Only owner can withdraw fund");
        if (msg.sender != i_owner) { revert FundMe__NotOwner(); }
        _;
    }

    // /** @notice Receives fund when msg.data is empty
    //  *  @dev Called when no other function matches with contract function
    //  */
    // receive() external payable {
    //     fund();
    // }

    // /** @notice Receives fund when msg.data is not empty
    //  *  @dev Called when no other function matches with contract function
    //  */
    // fallback() external payable {
    //     fund();
    // }

    /** @notice This function receives fund from anyone
     *  @dev Function maintain funders list
     */
    function fund() public payable {
        // Want to be able to set a minimum fund amount in USD
        // Send some ETH to this contract?
        require(msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD, "Didn't send enough ETH!");
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] += msg.value;
    }

    /** @notice Withdraw fund only by owner
     *  @dev Withdraws fund from all funders and empty their fund
     */
    function withdraw() public onlyOwner {
        for (uint256 funderIndex = 0; funderIndex < s_funders.length; funderIndex++) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        // reset the funders array
        s_funders = new address[](0);

        // // transfer
        // payable(msg.sender).transfer(address(this).balance);
        // // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "send failed");
        // call 
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "call failed");
    }

    /** @notice Withdraw fund only by owner (optimized storage usage)
     *  @dev Withdraws fund from all funders and empty their fund
     */
    function cheaperWithdraw() public onlyOwner() {
        address[] memory funders = s_funders;
        for (uint256 funderIndex = 0; funderIndex < funders.length; ++funderIndex) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        (bool success,) = i_owner.call{value: address(this).balance}("");
        require(success);
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunders(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmountFunded(address funder) public view returns (uint256) {
        return s_addressToAmountFunded[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
