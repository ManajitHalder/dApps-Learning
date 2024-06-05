// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CallCallee {
    function prod(uint256 x) public pure returns (uint256) {
        return x * 4;
    }
}

contract CallCaller {

    function callProd(address callee, uint256 x) public returns (uint256) {
        (bool success, bytes memory data) = callee.call(
            abi.encodePacked(CallCallee.prod.selector, x)
        );

        require(success, "Call failed");
        return abi.decode(data, (uint256));
    }
}