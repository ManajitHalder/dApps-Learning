// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StaticcallCallee {
    function callSome(uint256 x) public pure returns (uint256) {
        return x * 4;
    }
}

// staticcall is used for view or pure functions, ensuring that no state changes occur
contract StaticcallCaller {
    address staticcallCallee;

    constructor(address _callee) {
        staticcallCallee = _callee;
    }

    function callProd(uint256 x) public returns (uint256) {
        (bool success, bytes memory data) = staticcallCallee.delegatecall(
            abi.encodeWithSignature("callSome(uint256)", x)
        );

        require(success, "staticcall failed");
        return abi.decode(data, (uint256));
    }
}