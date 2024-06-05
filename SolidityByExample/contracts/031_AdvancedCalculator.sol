// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./031_ExternalMath.sol";

contract AdvancedCalculator {
    address externalMathLibrary;

    constructor(address _externalMathLibrary) {
        externalMathLibrary = _externalMathLibrary;
    }

    function calculateProduct(uint256 a, uint256 b) public returns (uint256) {
        (bool success, bytes memory result) = externalMathLibrary.delegatecall(
            abi.encodeWithSelector(ExternalMath.multiply.selector, a, b)
        );
        require(success, "Library call failed");
        return abi.decode(result, (uint256));
    }

}
