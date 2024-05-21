// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Mapping {
    // Mapping from address to uint
    mapping(address => uint256) public myMap;

    function get(address _addr) public view returns (uint256) {
        return myMap[_addr];
    }

    function set(address _addr, uint256 value) public {
        myMap[_addr] = value;
    }

    function remove(address _addr) public {
        delete myMap[_addr];
    }
}
