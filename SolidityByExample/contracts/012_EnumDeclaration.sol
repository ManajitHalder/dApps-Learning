// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EnumDeclaration {
    enum Status {
        Pending,
        Shipped,
        Accepted,
        Rejected,
        Cancelled
    }
}
