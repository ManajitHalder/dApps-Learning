// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Some gas saving techniques.

//     Replacing memory with calldata
//     Loading state variable to memory
//     Replace for loop i++ with ++i
//     Caching array elements
//     Short circuit

contract GasOptimization {
    // start - 50908 gas
    // use calldata - 49163 gas
    // load state variables to memory - 48952 gas
    // short circuit - 48634 gas
    // loop increments - 48244 gas
    // cache array length - 48209 gas
    // load array elements to memory - 48047 gas
    // uncheck i overflow/underflow - 47309 gas

    uint256 public total;

    // gas	58400 gas
    // transaction cost	50782 gas
    // execution cost	28598 gas

    // start - without gas optimization
    // function sumIfEvenAndLessThan99(uint[] memory nums) external {
    //     for (uint i = 0; i < nums.length; i++) {
    //         bool isEven = nums[i] % 2 == 0;
    //         bool isLessThan99 = nums[i] < 99;
    //         if (isEven && isLessThan99) {
    //             total += nums[i];
    //         }
    //     }
    // }

    // gas	53930 gas
    // transaction cost	46895 gas
    // execution cost	24711 gas

    // gas optimized
    // [1, 2, 3, 4, 5, 100]
    function sumIfEvenAndLessThan99(uint256[] calldata nums) external {
        uint256 _total = total;
        uint256 len = nums.length;

        for (uint256 i = 0; i < len; ) {
            uint256 num = nums[i];
            if (num % 2 == 0 && num < 99) {
                unchecked {
                    _total += num;
                }
            }
            unchecked {
                ++i;
            }
        }

        total = _total;
    }
}
