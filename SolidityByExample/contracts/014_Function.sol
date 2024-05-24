// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Function {
    // Function can return multiple values
    function returnMany() public pure returns (uint256, bool, uint256) {
        return (1, true, 3);
    }

    // Return values can be named
    function returneNamed() public pure returns (uint256 x, bool y, uint256 z) {
        return (4, false, 6);
    }

    // Return values can be assigned to their name.
    // In this case the return statement can be omitted.
    function returnAssigned() public pure returns (uint256 x, bool y, uint256 z) {
        x = 23;
        y = true;
        z = 45;
    }

    // Use destructuring assignment when calling another function that returns multiple values.
    function destructuringAssignment() public pure returns (uint256, bool, uint256, uint256, uint256) {
        (uint256 i, bool j, uint256 k) = returnMany();

        // Values can be left out.
        (uint256 x, , uint256 z) = (4, 5, 6);

        return (i, j, k, x, z);
    }

    // Can't use map for either input or output

    // Can use array for input
    function arrayInput(uint256[] memory _arr) public {}

    // Can use array for output
    uint256[] public arr;
    function arrayOutput() public view returns (uint256[] memory) {
        uint256[] memory arr2 = arr;
        return arr2;
    }
}

// Call function with key-value input
contract Function2 {
    function functionWithManyInputs(
        uint256 x,
        uint256 y,
        uint256 z,
        address a,
        bool b,
        string memory c
    ) public pure returns (uint256) {}

    function callFunc() external pure returns (uint256) {
        return functionWithManyInputs(1, 2, 3, address(0), true, "c");
    }

    function functionWithKeyValue() external pure returns (uint256) {
        return functionWithManyInputs({
            a: address(0),
            b: true,
            c: "string",
            x: 31,
            y: 23,
            z: 42
        });
    }
}
