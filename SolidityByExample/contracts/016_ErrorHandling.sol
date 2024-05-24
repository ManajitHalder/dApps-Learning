// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
An error will undo all changes made to the state during a transaction.

You can throw an error by calling require, revert or assert.

    require is used to validate inputs and conditions before execution.
    revert is similar to require. See the code below for details.
    assert is used to check for code that should never be false. Failing assertion probably means that there is a bug.

Use custom error to save gas.
*/

contract Error {
    function testRequire(uint256 i) public pure {
        /*  
        Require should be used to validate conditions such as:
         - inputs
         - conditions before execution
         - return values from calls to other functions
        */
        require(i > 10, "input must be greater that 10");
    }

    function testRevert(uint256 _i) public pure {
        /*
        Revert is useful when condition to check is complex.
        */
        if (_i <= 10) {
            revert("input must be greater than 10");
        }
    }

    uint256 public num;

    function testAssert() public view {
        /*
        Assert should only be used to test for internal errors, and to check for invariants.
        */
        assert(num == 0);
    }

    // custom error
    // error InsufficientBalance(uint256 balance, uint256 withdrawAmount);
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function testForCustomError(uint256 _withdrawAmount) public view {
        uint256 bal = address(this).balance;
        if (bal < _withdrawAmount) {
            revert InsufficientBalance({
                balance: bal,
                withdrawAmount: _withdrawAmount
            });
            // revert InsufficientBalance(bal, _withdrawAmount);
        }
    }
}

contract Account {
    uint256 public balance;

    function deposit(uint256 _amount) public {
        uint256 oldBalance = balance;
        uint256 newBanalce = balance + _amount;

        // balance + amount does not overflow if balance + _amount >= balance
        require(newBanalce >= oldBalance, "Overflow");

        balance = newBanalce;

        assert(balance >= oldBalance);
    }

    function withdraw(uint256 _amount) public {
        uint256 oldBalance = balance;

        // balance - _amount does not underflow if balance >= amount
        require(_amount <= balance, "Underflow");

        if (balance <= _amount) {
            revert("Underflow");
        }

        balance -= _amount;

        assert(balance <= oldBalance);
    }
}
