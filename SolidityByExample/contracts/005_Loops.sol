// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Loops {
    function loop() public pure {
        for (uint i = 0; i < 10; i++) {
            if (i == 3) {
                // skip to next iteration
                continue;
            }
            if (i == 5) {
                // exit the loop
                break;
            }
        }

        uint j;
        while (j < 10) {
            j++;
        }
    }
}
