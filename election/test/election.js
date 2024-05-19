var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {
	var electionInstance;

	// Test case 1: Ensuring the contract initializes with two candidates
	it("initializes with two candidates", function() {
		// Get the deployed instance of the contract
		return Election.deployed().then(function(instance) {
			return instance.candidatesCount();
		}).then(function(count) {
			assert.equal(count, 2);
		});
	});

	// Test case 2: Checking the initial values of the candidates
	it("it initializes the candidates with the correct values of name and id", function() {
		return Election.deployed().then(function(instance) {
			electionInstance = instance;
			return electionInstance.candidates(1);
		}).then(function(candidate) {
			assert.equal(candidate[0], 1, "contains correct id");
			assert.equal(candidate[1], "Reyansh Halder", "contains correct name");
			assert.equal(candidate[2], 0, "contains correct votes count");
			return electionInstance.candidates(2);
		}).then(function(candidate) {
			assert.equal(candidate[0], 2, "contains correct id");
			assert.equal(candidate[1], "Agastya Halder", "contains correct name");
			assert.equal(candidate[2], 0, "contains correct votes count");
		})
	});

	// Test case 3: Allows a candidate to cast vote
	it("allows a voter to cast a vote", function() {
		return Election.deployed().then(function(instance) {
			electionInstance = instance
			candidateId = 1;
			return electionInstance.vote(candidateId, { from: accounts[0] });
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, "an event was triggered");
    		// assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
    		assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");
    		return electionInstance.voters(accounts[0]);
		}).then(function(voted) {
			assert(voted, "the voter was marked as voted");
			return electionInstance.candidates(candidateId);
		}).then(function(candidate) {
			var voteCount = candidate[2];
			assert.equal(voteCount, 1, "increment the candidates vote count");
		})
	});

	// Test case 4: Throws an exception for invalid candidates
	it("throws an exception fro invalid candidate", function() {
		return Election.deployed().then(function(instance) {
			electionInstance = instance;
			return electionInstance.vote(18, { from: accounts[1] })
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >=0, "error message must contain revert");
			return electionInstance.candidates(1);
		}).then(function(candidate1) {
			var voteCount = candidate1[2];
			assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
			return electionInstance.candidates(2);
		}).then(function(candidate2) {
			var voteCount = candidate2[2];
			assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
		});
	});


	// Test case 5: Throws an exception for double voting
	it("throws an exception for double voting", async function() {
      const electionInstance = await Election.deployed();
      const accounts = await web3.eth.getAccounts();
      const candidateId = 2;

      // Reset vote for both candidates
      await electionInstance.resetVote(1);
      await electionInstance.resetVote(2);

      // Cast first vote
      await electionInstance.vote(candidateId, { from: accounts[2] });

      // Check vote count after first vote
      let candidate = await electionInstance.candidates(candidateId)
      let voteCount = candidate[2].toNumber();
      assert.equal(voteCount, 1, "accepts first vote");

      // Try to vote again and expect it to fail
      try {
      	await electionInstance.vote(candidateId, { from: accounts[2] });
      	assert.fail("Expected revert not received");
      } catch (error) {
      	assert(error.message.includes("revert"), "Expected 'revert', got '" + error.message + "'instead");
      }

      // Validate that no additional votes were cast
      candidate = await electionInstance.candidates(1);
      voteCount = candidate[2].toNumber();
      assert.equal(voteCount, 0, `candidate 1 did not receive any vote, but received ${voteCount}`);

      candidate = await electionInstance.candidates(2);
      voteCount = candidate[2].toNumber();
      assert.equal(voteCount, 1, `candidate 2 did not receive any additional votes, but received ${voteCount}`);
  });
});

