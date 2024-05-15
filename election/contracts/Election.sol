// SPDX-License-Identifier: MIT
pragma solidity >= 0.4.22 < 0.8.0;

contract Election {
	// Model Candidate
	struct Candidate {
		uint id;
		string name;
		uint voteCount;
	}

	// Fetch Candidate
	mapping(uint => Candidate) public candidates;

	// Store Candidates count
	uint public candidatesCount;

	constructor() public {
		addCandidate("Reyansh Halder");
		addCandidate("Agastya Halder");
	}

	function addCandidate(string memory _name) private {
		candidatesCount++;
		candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
	}
}