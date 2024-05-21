// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Solidity supports enumerables and they are useful to model choice and keep track of state.
// Enums can be declared outside of a contract.
contract Enum {
    // Enum representing shipping status
    enum Status {
        Pending,
        Shipped,
        Accepted,
        Rejected,
        Canceled
    }

    // Defualt value is the first element listed in the definition of the enum, in this case 'Pending'.
    Status public status;

    // Returns units
    // Pending  - 0
    // Shipped  - 1
    // Accepted - 2
    // Rejected - 3
    // Canceled - 4
    function get() public view returns (Status) {
        return status;
    }

    function set(Status _status) public {
        status = _status;
    }

    // Set status to specific value
    function cancel() public {
        status = Status.Canceled;
    }

    // delete resets the enum to its first value, i.e. 0
    function reset() public {
        delete status;
    }
}
