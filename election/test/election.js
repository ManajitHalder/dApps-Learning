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
});

