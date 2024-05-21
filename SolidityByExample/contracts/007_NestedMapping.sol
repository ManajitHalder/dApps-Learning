// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NestedMapping {
    // Mapping from address to another mapping
    mapping(address => mapping(uint256 => bool)) nestedMap;

    function get(address _addr, uint256 _i) public view returns (bool) {
        return nestedMap[_addr][_i];
    }

    function set(address _addr, uint256 _i, bool _b) public {
        nestedMap[_addr][_i] = _b;
    }

    function remove(address _addr, uint256 _i) public {
        delete nestedMap[_addr][_i];
    }
}
