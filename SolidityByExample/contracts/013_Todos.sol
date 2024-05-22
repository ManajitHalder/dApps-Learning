// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./013_TodoStructDeclaration.sol";

contract Todos {
    // An array of 'Todo' structs
    Todo[] public todos;

    function create(string calldata _text) public {
        // 3 ways to initialize a struct
        // - calling it like a function
        todos.push(Todo(_text, false));

        // - Key value mapping
        todos.push(Todo({text: _text, completed: false}));

        // - initialze an empty struct and then update it
        Todo memory todo;
        todo.text = _text;
        // todo.completed is intialized to 0 by default
        todos.push(todo);
    }

    // Solidity automatically created a getter for 'todos'. You do not need to define getter function.
    function get(
        uint256 _index
    ) public view returns (string memory text, bool completed) {
        require(_index < todos.length, "Index out of bounds");
        
        Todo storage todo = todos[_index];
        return (todo.text, todo.completed);
    }

    // update text
    function updateText(uint256 _index, string calldata _text) public {
        Todo storage todo = todos[_index];
        todo.text = _text;
    }

    // update completed
    function updateCompleted(uint256 _index) public {
        Todo storage todo = todos[_index];
        todo.completed = !todo.completed;
    }
}
