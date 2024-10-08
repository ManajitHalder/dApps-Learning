// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
// pragma solidity ^0.8.7;

contract SimpleStorage {
    uint256 favoriteNumber;

    struct People {
        uint256 favoriteNumber;
        string name;
    }

    People[] public people;

    mapping(string => uint256) nameToFavoriteNumber;

    function store(uint256 _favoriteNumber) public virtual {
        favoriteNumber = _favoriteNumber;
    }

    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }

    function addPerson(string calldata _name, uint256 _favoriteNumber) public {
        nameToFavoriteNumber[_name] = _favoriteNumber;
        people.push(People(_favoriteNumber, _name));
    }

    function getFavoriteNumberByName(string calldata _name) public view returns(uint256) {
        return nameToFavoriteNumber[_name];
    }
}
