// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Note: Deploy this contract first
contract DelegateB {
    // Note: storage layout must be the same as contract A
    uint256 public num;
    address public sender;
    uint256 public value;

    function setVars(uint256 _num) public payable {
        num = _num;
        sender = msg.sender;
        value = msg.value;
    }
}

contract DelegateA {
    uint256 num;
    address sender;
    uint256 value;

    event DelegateResponse(bool success, bytes data);

    function setVars(address _contract, uint256 _num) public payable {
        // A's storage is set, B is not modified.
        (bool success, bytes memory data) = _contract.delegatecall(
            abi.encodeWithSignature("setVars(uint256)", _num)
        );

        emit DelegateResponse(success, data);
    }
}