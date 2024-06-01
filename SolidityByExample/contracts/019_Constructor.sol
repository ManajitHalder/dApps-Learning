// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract X {
    string public name;

    constructor(string memory _name) {
        name = _name;
    }
}

contract Y {
    string public designation;

    constructor(string memory _desig) {
        designation = _desig;
    }
}

// There are 2 ways to initialize parent contract with parameters.

// Pass the parameters here in the inheritance list.
contract BB is X("Bottleguard"), Y("Vegetable") {}

contract CC is X, Y {
    // Pass the parameters here in the constructor,
    // similar to function modifiers.
    constructor(string memory _name, string memory _desig) X(_name) Y(_desig) {}
}

// Parent constructors are always called in the order of inheritance
// regardless of the order of parent contracts listed in the
// constructor of the child contract.

// Order of constructors called:
// 1. X
// 2. Y
// 3. DD
contract DD is X, Y {
    constructor() X("Cocoanut") Y("Fruit") {}
}

// Order of constructors called:
// 1. X
// 2. Y
// 3. EE
contract EE is X, Y {
    constructor() Y("Material") X("Stone") {}
}
