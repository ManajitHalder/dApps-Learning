// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITarget {
    function decrement(int256 num) external payable;
    function nonExistentFunction() external;
}

contract Target {
    int256 public count;
    event Log(string funcName, uint256 gas);

    function decrement(int256 num) public payable {
        count = count - num;
    }

    receive() external payable {
        count += 3;
        emit Log("receive", gasleft());
    }

    fallback() external payable {
        count++;
        emit Log("fallback", gasleft());
    }
}

contract TargetCaller {
    int256 private value = 5;
    function callFallback(address _target) public {
        ITarget target = ITarget(_target);
        target.nonExistentFunction();
    }

    function callDecrement(address _target) public {
        ITarget target = ITarget(_target);
        target.decrement(value);
    }
}
