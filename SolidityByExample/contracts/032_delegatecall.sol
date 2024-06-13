// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DelegatecallCallee {
    function callSome(uint256 x) public pure returns (uint256) {
        return x * 4;
    }
}

contract DelegatecallCaller {
    address delegatecallCallee;

    constructor(address _callee) {
        delegatecallCallee = _callee;
    }

    function callProd(uint256 x) public returns (uint256) {
        (bool success, bytes memory data) = delegatecallCallee.delegatecall(
            abi.encodeWithSignature("callSome(uint256)", x)
        );

        require(success, "delegatecall failed");
        return abi.decode(data, (uint256));
    }
}