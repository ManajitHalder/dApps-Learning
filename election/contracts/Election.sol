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

	// Store voter has voted
	mapping(address => bool) public voters;

	// Vote event
	event VotedEvent(uint indexed _candidateId);

	constructor() public {
		addCandidate("Reyansh Halder");
		addCandidate("Agastya Halder");
	}

	function addCandidate(string memory _name) private {
		candidatesCount++;
		candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
	}

	// Record vote
	function vote(uint _candidateId) public {
		// require that the voter haven't voted
		require(!voters[msg.sender], "Voter has already voted");
		// require a valid candidate
		require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate Id");

		// record that voter has voted
		voters[msg.sender] = true;

		// update candidate vote count
		candidates[_candidateId].voteCount++;

		// emit the vote event
		emit VotedEvent(_candidateId);
	}

	// Reset voting
	function resetVote(uint _candidateId) public {
		voters[msg.sender] = false;
		candidates[_candidateId].voteCount = 0;
	}
}
