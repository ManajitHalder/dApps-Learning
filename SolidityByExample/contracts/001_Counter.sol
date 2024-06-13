// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter {
    uint public count;

    function get() public view returns (uint) {
        return count;
    }

    function set(uint _count) public {
        count = _count;
    }

    function increment() public {
        count += 1;
    }

    // function decrement() public {
    //     count -= 1;
    // }
}
