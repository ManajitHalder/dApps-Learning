// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Base {
    // Private function can only be called
    // - inside this contract
    // Contracts that inherit this contract cannot call this function.
    function privateFunction() private pure returns (string memory) {
        return "private function called";
    }

    function testPrivateFunction() public pure returns (string memory) {
        return privateFunction();
    }

    // Internal function can be called
    // - inside this contract
    // - inside contracts that inherit this contract
    function internalFunction() internal pure returns (string memory) {
        return "internal function called";
    }

    function testInternalFunction()
        public
        pure
        virtual
        returns (string memory)
    {
        return internalFunction();
    }

    // Public functions can be called
    // - inside this contract
    // - inside contracts that inherit this contract
    // - by other contracts and accounts
    function publicFunction() public pure returns (string memory) {
        return "public function called";
    }

    // External functions can only be called
    // - by other contracts and accounts
    function externalFunction() external pure returns (string memory) {
        return "external function called";
    }

    // This function will not compile since we're trying to call
    // an external function here.
    // function testExternalFunction() public pure returns (string memory) {
    //     return externalFunction();
    // }

    // Correct way to call an external function internally
    function testExternalFunction() public view returns (string memory) {
        return this.externalFunction();
    }

    // State variables
    string private privateVar = "private variable";
    string internal internalVar = "internal variable";
    string public publicVar = "public variable";
    // State variables cannot be external so this code won't compile.
    // string external externalVar = "external variable";
}

contract Child is Base {
    // Inherited contracts do not have access to private functions
    // and state variables.
    // function testPrivateFunctionChild() public pure returns (string memory) {
    //     return privateFunction();
    // }

    // Only internal and public functions can be called inside child contracts.
    function testInternalFunction()
        public
        pure
        override
        returns (string memory)
    {
        return testInternalFunction();
    }

    function testPublicFunctionInChild() public pure returns (string memory) {
        return publicFunction();
    }
}
