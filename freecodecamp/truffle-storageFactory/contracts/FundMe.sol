// Get funds from users
// Withdraw funds
// Set a minimum funding value in USD

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PriceConverter.sol";

error NotOwner();

contract FundMe {
    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 50 * 1e18;
    address public immutable i_owner;
   
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    constructor() {        
        i_owner = msg.sender;
    }

    modifier onlyOwner() {
        // require(msg.sender == i_owner, "Only owner can call this function");
        if (msg.sender != i_owner) {
            revert NotOwner();
        }
        _;
    }

    function fund() public payable {
        // Want to be able to set a minimum fund amount in USD
        // Send some ETH to this contract?
        require(msg.value.getConversionRate() >= MINIMUM_USD, "Didn't send enough!");
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

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

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }
}
