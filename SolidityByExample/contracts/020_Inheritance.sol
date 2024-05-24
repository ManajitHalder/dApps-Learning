// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract A {
    function foo() public pure virtual returns (string memory) {
        return "A";
    }
}

contract B is A {
    // Override A.foo()
    function foo() public pure virtual override returns (string memory) {
        return "B";
    }
}

contract C is A {
    // Override A.foo()
    function foo() public pure virtual override returns (string memory) {
        return "C";
    }
}

// Contracts can inherit from multiple parent contracts.
// When a function is called that is defined multiple times in
// different contracts, parent contracts are searched from
// right to left, and in depth-first manner.

contract D is B, C {
    // D.foo() returns "C"
    // Since C is the right most parent contract with function foo()
    function foo() public pure virtual override(B, C) returns (string memory) {
        return super.foo();
    }
}

contract E is C, B {
    // E.foo() returns "B"
    // since B is the right most parent contract with function foo()
    function foo() public pure virtual override(C, B) returns (string memory) {
        return super.foo();
    }
}

// Inheritance must be ordered from “most base-like” to “most derived”.
// Swapping the order of A and B will throw a compilation error.
contract F is A, B {
    function foo() public pure virtual override(A, B) returns (string memory) {
        return super.foo();
    }
}

// Calling parent function of he base contract from derived contracts function.
contract Parent {
    string public parentStr;

    function setParentStr(string memory _parentStr) public {
        parentStr = _parentStr;
    }

    // greet() will be overridden in base function
    function greet() public pure virtual returns (string memory) {
        return "Namaste from Parent";
    }

    function helloParent() public pure returns (string memory) {
        return "Hello ";
    }
}

contract Child is Parent {
    string public childStr;

    function setChildStr(string memory _childStr) public {
        childStr = _childStr;
    }

    // Overriding Parents greet function
    function greet() public pure override returns (string memory) {
        return "Namaste from Child";
    }

    // Calling Parents function helloParent()
    function helloChild() public pure returns (string memory) {
        return string(abi.encodePacked(super.helloParent(), "Manajit"));
    }
}

// Abstract contract example
abstract contract AbstractContract {
    function abstractFunction() public virtual;
}

contract ConcreteContract is AbstractContract {
    function abstractFunction() public override {}
}
