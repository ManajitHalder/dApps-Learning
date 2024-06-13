// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// External contract used for try/catch examples
contract tcFoo {
    address public owner;

    constructor(address _owner) {
        require(_owner != address(0), "invalid address");
        assert(_owner != 0x0000000000000000000000000000000000000001);
        owner = _owner;
    }

    function myFunc(uint256 x) public pure returns (string memory) {
        require(x != 0, "require failed");
        return "my function was called";
    }
}

contract callingExternalFunc {
    event Log(string message);
    event LogBytes(bytes data);

    tcFoo public tc;

    constructor() {
        // This Foo contract is used for example of try catch with external call
        tc = new tcFoo(msg.sender);
    }

    // Example of try / catch with external call
    // tryCatchExternalCall(0) => Log("external call failed")
    // tryCatchExternalCall(1) => Log("my func was called")
    function tryCatchExternalCall(uint256 _i) public {
        try tc.myFunc(_i) returns (string memory result) {
            emit Log(result);
        } catch {
            emit Log("external call failed");
        }
    }

    // Example of try / catch with contract creation
    // tryCatchNewContract(0x0000000000000000000000000000000000000000) => Log("invalid address")
    // tryCatchNewContract(0x0000000000000000000000000000000000000001) => LogBytes("")
    // tryCatchNewContract(0x0000000000000000000000000000000000000002) => Log("Foo created")
    function tryCatchNewContract(address _owner) public {
        try new tcFoo(_owner) {
            emit Log("tcFoo created");
        } catch Error(string memory reason) {
            emit Log(reason);
        } catch (bytes memory data) {
            emit LogBytes(data);
        }
    }
}
