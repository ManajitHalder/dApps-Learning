// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BasicWallet {
    // owner address
    address public owner;

    // event of withdrawl
    event Withdraw(address indexed owner, uint256 amount);

    // modifier to restrict withdrawal to owner only
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can withdraw Ether");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Fallback function to receive ETH
    receive() external payable {}

    // withdraw function to withdraw ether by owner only
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Insufficient balance");

        (bool success, ) = owner.call{value: balance}("");
        require(success, "Transfer failed");

        emit Withdraw(owner, balance);
    }

    // check balance of the contract
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
