// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Car {
    address public owner;
    string public model;
    address public carAddress;

    constructor(address _owner, string memory _model) payable {
        owner = _owner;
        model = _model;
        carAddress = address(this);
    }
}

contract CarFactory {
    Car[] public cars;

    function create(address _owner, string memory _model) public {
        Car car = new Car(_owner, _model);
        cars.push(car);
    }

    function createAndSendEther(
        address _owner,
        string memory _model
    ) public payable {
        Car car = (new Car){value: msg.value}(_owner, _model);
        cars.push(car);
    }

    function create2(
        address _owner,
        string memory _model,
        bytes32 _salt
    ) public {
        Car car = new Car{salt: _salt}(_owner, _model);
        cars.push(car);
    }

    function create2AndSendEther(
        address _owner,
        string memory _model,
        bytes32 _salt
    ) public payable {
        Car car = (new Car){value: msg.value, salt: _salt}(_owner, _model);
        cars.push(car);
    }

    // Get car by index
    function getCar(
        uint256 index
    )
        public
        view
        returns (
            address owner,
            string memory model,
            address carAddress,
            uint256 balance
        )
    {
        Car car = cars[index];
        return (
            car.owner(),
            car.model(),
            car.carAddress(),
            address(car).balance
        );
    }
}
