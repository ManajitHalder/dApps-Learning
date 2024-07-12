# Hardhat lottery project using chainlink VRF and Keepers

## Create a hardhat project

yarn add --dev hardhat

yarn hardhat

-   create an empty hardhat.config.js

Install all dependencies. After installation check for all pacakges installed under section "devDependencies".

yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle chai ethereum-waffle hardhat hardhat-contract-sizer hardhat-deploy hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage dotenv

Insltall commands specific version:

```
yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers@^0.3.0-beta.13
yarn add --dev @nomiclabs/hardhat-etherscan@^3.0.0
yarn add --dev @nomiclabs/hardhat-waffle@^2.0.1
yarn add --dev chai@^4.3.4
yarn add --dev ethereum-waffle@^3.4.0
yarn add --dev ethers@^5.5.1
yarn add --dev hardhat@^2.6.7
yarn add --dev hardhat-contract-sizer@^2.4.0
yarn add --dev hardhat-deploy@^0.9.29
yarn add --dev hardhat-gas-reporter
yarn add --dev prettier
yarn add --dev prettier-plugin-solidity
yarn add --dev solhint
yarn add --dev solidity-coverage
yarn add --dev dotenv
```

Add the packages added to hardhat.config.js file:

```
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()
```

Add .prettierrc and its content:

```
{
    "useTabs": false,
    "singleQuote": false,
    "tabWidth": 4,
    "semi": false,
    "printWidth": 100
}
```

## Crate a smart contract contracts/Raffle.sol (lottery)

Raffle Meaning:

-   A means of raising money by selling numbered tickets, one or some of which are subsequently drawn at random, the holder or holders of such tickets winning a prize.

Feature provided by the contract:

-   User the participates the lottery by paying some amount
-   Lottery picks a random winner (varifiable random winner by using Chainlink VRF)
-   Winner to be selected at certian interval (minutes/days/months/etc) using completely automated mechanism.
-   Contract uses Chainlink Oracles for Randomness (VRF) and Automated execution (Keeprs)

### Raffle.sol contents:

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

error Raffle__NotEnoughETHEntered();

contract Raffle {
    uint256 private immutable i_entranceFee;

    constructor(uint256 entranceFee) {
        i_entranceFee = entranceFee;
    }

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) { revert Raffle__NotEnoughETHEntered(); }
    }

    // function pickRandomWinnder() {}

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }
}
```

Compile Raffle.sol and resolve and error and dependency package installation using yarn add --dev

```
yarn hardhat compile
```

## Add VRF code

Add @chainlink/contracts package

```
yarn add --dev @chainlink/contracts
```

## Add hardhat-shorthand package for shorthand commands

```
yarn global add hardhat-shorthand
```

Now running hh would mean yarn hardhat. Command to compile:

```
hh compile
```

## Code after implementing chainlink VRF:

```
// Feature provided by the contract:
// -   User the participates the lottery by paying some amount
// -   Lottery picks a random winner (varifiable random winner by using Chainlink VRF)
// -   Winner to be selected at certian interval (minutes/days/months/etc) using completely automated mechanism.
// -   Contract uses Chainlink Oracles for Randomness (VRF) and Automated execution (Keeprs)

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";

error Raffle__NotEnoughETHEntered();
error Raffle__TransferredFailed();

contract Raffle is VRFConsumerBaseV2 {
    /* Storage variables */
    uint256 private immutable i_entranceFee;
    address payable[]  private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane; //keyHash
    uint64 private immutable i_subscriptionId;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private immutable i_callbackGasLimit;
    uint32 private constant NUM_WORDS = 1;

    /* Lottery variables */
    address payable private s_recentWinner;

    /* Events */
    event RaffleEnter(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requrestId);
    event WinnerPicked(address indexed winner);

    constructor(
        uint256 entranceFee,
        address vrfCoordinatorV2,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit
        ) VRFConsumerBaseV2(vrfCoordinatorV2)
    {
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) { revert Raffle__NotEnoughETHEntered(); }
        s_players.push(payable(msg.sender));
        // Emit an event when we update a dynamic array or mapping
        emit RaffleEnter(msg.sender);
    }

    function requestRandomWinnder() external {
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        emit RequestedRaffleWinner(requestId);
    }

    function fulfillRandomWords(
        uint256 /* requestId */,
        uint256[] memory randomWords) internal override
    {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        if (!success) {
            revert Raffle__TransferredFailed();
        }
        emit WinnerPicked(recentWinner);
    }

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }
}
```

## Code after implementing chainlink Automation:

```
// Feature provided by the contract:
// -   User the participates the lottery by paying some amount
// -   Lottery picks a random winner (varifiable random winner by using Chainlink VRF)
// -   Winner to be selected at certian interval (minutes/days/months/etc) using completely automated mechanism.
// -   Contract uses Chainlink Oracles for Randomness (VRF) and Automated execution (Keeprs)

// Refer the following url for Chainlink VRF:
// -   https://docs.chain.link/vrf/v2/subscription/examples/get-a-random-number

// Refer the following url for Chainlink Automation:
// -   https://docs.chain.link/chainlink-automation/guides/compatible-contracts

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";

error Raffle__NotEnoughETHEntered();
error Raffle__TransferredFailed();
error Raffle__NotOpen();
error Raffle__UpkeepNotNeeded(uint256 currentBalance, uint256 numPlayers, uint256 raffleState);

/**
 * @title A sample Raffle (Lottery) contract
 * @author Manajit Halder
 * @notice This contract is for creating an untamperable decentralized smart contract
 * @dev This contract implements Chainlink VRF and Chainlink Automation
 */
contract Raffle is VRFConsumerBaseV2, AutomationCompatibleInterface {
    /* Type declarations */
    enum RaffleState {
        OPEN,
        CALCULATING
    }

    /* Storage variables */
    uint256 private immutable i_entranceFee;
    address payable[]  private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane; //keyHash
    uint64 private immutable i_subscriptionId;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private immutable i_callbackGasLimit;
    uint32 private constant NUM_WORDS = 1;

    /* Lottery variables */
    address payable private s_recentWinner;

    // Chainlink Automation
    RaffleState private s_raffleState;
    uint256 private s_lastBlockTimestamp;
    uint256 private immutable i_interval;

    /* Events */
    event RaffleEnter(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requrestId);
    event WinnerPicked(address indexed winner);

    constructor(
        uint256 entranceFee,
        address vrfCoordinatorV2,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        uint256 interval
        ) VRFConsumerBaseV2(vrfCoordinatorV2)
    {
        // Chainlink VRF
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;

        // Chainlink Automation
        s_raffleState = RaffleState.OPEN;
        s_lastBlockTimestamp = block.timestamp;
        i_interval = interval;
    }

    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) { revert Raffle__NotEnoughETHEntered(); }
        if (s_raffleState != RaffleState.OPEN) { revert Raffle__NotOpen(); }
        s_players.push(payable(msg.sender));
        // Emit an event when we update a dynamic array or mapping
        emit RaffleEnter(msg.sender);
    }

    /**
     * @dev This function performs complex calculations offchain and then send the result to performUpkeep.
     * The chainlink Automation call this function and look for 'upkeepNeeded' to return true.
     * The follwing should be true in order to return true.
     * 1. Our time interval should have passed.
     * 2. The raffle should have atleast 1 player, and have some ETH.
     * 3. Our subscription is funded with LINK
     * 4. The raffle should be in an "open" state.
     */
    function checkUpkeep(
        bytes memory /* checkData */
    ) public view override returns (
        bool upkeepNeeded,
        bytes memory /* performData */) {
            bool timepassed =  ((block.timestamp - s_lastBlockTimestamp) > i_interval);
            bool hasPlayers = (s_players.length > 0);
            bool hasBalance = (address(this).balance > 0);
            bool isOpen = (s_raffleState == RaffleState.OPEN);

            upkeepNeeded = (timepassed && hasPlayers && hasBalance && isOpen);
    }

    /**
     * @dev This function is triggered after checkUpkeep returns true for upkeepNeeded. This function
     * will be executed onchain unlike checkUpkeep() function which is executed offchain.
     * The chainlink perform actual computation here. In this it is getting random word using chainlink
     * VRF.
     */
    function performUpkeep(bytes calldata /* performData */) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) { revert Raffle__UpkeepNotNeeded(address(this).balance, s_players.length, uint256(s_raffleState)); }

        s_raffleState = RaffleState.CALCULATING;

        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        emit RequestedRaffleWinner(requestId);
    }

    function fulfillRandomWords(
        uint256 /* requestId */,
        uint256[] memory randomWords) internal override
    {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        s_raffleState = RaffleState.OPEN;
        s_players = new address payable[](0);
        s_lastBlockTimestamp = block.timestamp;

        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        if (!success) {
            revert Raffle__TransferredFailed();
        }
        emit WinnerPicked(recentWinner);
    }

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    function getRaffleState() public view returns (RaffleState) {
        return s_raffleState;
    }

    function getNumWords() public pure returns (uint32) {
        return NUM_WORDS;
    }

    function getNumberOfPlayers() public view returns (uint256) {
        return s_players.length;
    }

    function getLatestTimestamp() public view returns (uint256) {
        return s_lastBlockTimestamp;
    }

    function getRequestConfirmations() public pure returns (uint256) {
        return REQUEST_CONFIRMATIONS;
    }
}
```

---

#

# New learnings

## <span style="color:orange">Get the block time stamp and Increases time interval of a block</span>

-   Get the latest block and block time stamp

```
const blockBefore = await ethers.provider.getBlock("latest")
const timeBefore = blockBefore.timestamp
```

-   Increase the time interval and mine a block

```
await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
await network.provider.send("evm_mine", [])
```

Complete code

```
it("enterRaffle: doesn't allow enterRaffle when raffle state is CALCULATING", async () => {
    /*
    To make this test pass we have to make the raffle state CALCULATING (not OPEN).
    There is only one way it is getting set to CALCULATION and it is in method performUpkeep
    function. After checkUpkeep returns true, raffle state is set to CALCULATING.

    CheckUpkeep can return true if it statifies the following conditions:
    if raffle state is OPEN
    if timepassed is greater than interval
    if raffle has atleat 1 player (which is already true)
    if raffle has some balance
    */

    await raffle.enterRaffle({ value: raffleEntranceFee })
    const blockBefore = await ethers.provider.getBlock("latest")
    const timeBefore = blockBefore.timestamp

    // increase time interval
    await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
    await network.provider.send("evm_mine", [])

    const blockAfter = await ethers.provider.getBlock("latest")
    const timeAfter = blockAfter.timestamp
    const timeInterval = await raffle.getInterval()

    console.log("Time before increasing time interval ", timeInterval.toNumber())
    console.log("Time after increasing time interval ", timeAfter - timeBefore)

    // we pretend to be chainlink keeper
    let state = await raffle.getRaffleState()
    console.log("Raffle state before performUpkeep: ", state.toString())

    await raffle.performUpkeep([])

    state = await raffle.getRaffleState()
    console.log("Raffle state after performUpkeep: ", state.toString())

    await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.be.revertedWith(
        "Raffle__NotOpen",
    )
})
```

## <span style="color:orange">Register a consumer contract to request and receive random words from the VRF coordinator</span>

The addConsumer function is used to register a consumer contract with the VRF coordinator.
The consumer contract is the one that will request random values and receive the random words
from the VRF coordinator.

### Key VRF-Related Functions

<span style="color:magenta">requestRandomWords: </span>

-   This function is called by the Raffle contract to request random words
    from the VRF coordinator.

<span style="color:magenta">fulfillRandomWords: </span>

-   This function is called by the VRF coordinator
    (or in your mock, by the test code) to deliver the random words to the Raffle contract.

### Raffle Contract Integration

In the Raffle contract, the flow typically looks something like this:

-   Perform Upkeep: The Raffle contract checks if it's time to pick a winner.
    This is done in the performUpkeep function.
-   Request Random Words: If it's time to pick a winner, the Raffle contract calls
    requestRandomWords on the VRF coordinator to get random values.
-   Receive Random Words: Once the random words are generated, the VRF coordinator
    calls fulfillRandomWords on the Raffle contract to provide the random values.

##

##

# Errors and Solutions

##

## <span style="color:red; font-weight:bold">1. Error (TypeError: Cannot read properties of undefined (reading 'length'))</span>

```
yarn hardhat deploy
```

### Problem:

-   Problem in calling getNamedAccounts(). getNamedAccounts() is an asynchronous function. Need to call using await.

```
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = getNamedAccounts()
    const chainId = network.config.chainId
    let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock
    const VRF_SUBSCRIPTION_FUND_AMOUNT = ethers.parseEther("1")
```

### Error while deploying contract

```
$ yarn hardhat deploy
yarn run v1.22.22
$ /Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/.bin/hardhat deploy
Nothing to compile
Local network detected! Deploying mocks...
deploying "VRFCoordinatorV2Mock" (tx: 0xd7c7dc9cc8ab82f01de02b3626f98c1f7d928b1f9f89c9129efc145d07f02ab6)...: deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3 with 2967891 gas
Mocks Deployed...
-----------------------------------------------------
An unexpected error occurred:

Error: ERROR processing /Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/deploy/01-deploy-raffle.js:
TypeError: Cannot read properties of undefined (reading 'length')
    at getFrom (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat-deploy/src/helpers.ts:1656:14)
    at fetchIfDifferent (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat-deploy/src/helpers.ts:834:34)
    at _deployOne (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat-deploy/src/helpers.ts:913:24)
    at DeploymentsManager.executeDeployScripts (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat-deploy/src/DeploymentsManager.ts:1215:19)
    at DeploymentsManager.runDeploy (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat-deploy/src/DeploymentsManager.ts:1061:5)
    at SimpleTaskDefinition.action (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat-deploy/src/index.ts:450:5)
    at Environment._runTaskDefinition (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat/src/internal/core/runtime-environment.ts:359:14)
    at Environment.run (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat/src/internal/core/runtime-environment.ts:192:14)
    at SimpleTaskDefinition.action (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat-deploy/src/index.ts:601:32)
    at Environment._runTaskDefinition (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat/src/internal/core/runtime-environment.ts:359:14)
    at Environment.run (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat/src/internal/core/runtime-environment.ts:192:14)
    at SimpleTaskDefinition.action (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat-deploy/src/index.ts:690:5)
    at Environment._runTaskDefinition (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat/src/internal/core/runtime-environment.ts:359:14)
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

### Solution:

Problem in 01-deploy-raffle.js file:

```
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock
    const VRF_SUBSCRIPTION_FUND_AMOUNT = ethers.parseEther("1")
```

<span style="color:green; font-weight:bold">getNamedAccounts() is an asynchronous function, need to wait using await while calling it.</span>

### Output after Solution:

```
$ yarn hardhat deploy
yarn run v1.22.22
$ /Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/.bin/hardhat deploy
Nothing to compile
Local network detected! Deploying mocks...
deploying "VRFCoordinatorV2Mock" (tx: 0xd7c7dc9cc8ab82f01de02b3626f98c1f7d928b1f9f89c9129efc145d07f02ab6)...: deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3 with 2967891 gas
Mocks Deployed...
-----------------------------------------------------
deploying "Raffle" (tx: 0x1893be130571d5f34ec168a7be6ec0a638f627576f24201bc81df03ab2f1b4cf)...: deployed at 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 with 1212096 gas
----------------------------------------------------------
✨  Done in 2.98s.
```

##

## <span style="color:red; font-weight:bold">2. Error (TypeError: Cannot read properties of undefined (reading '0'))</span>

```
yarn hardhat deploy
```

### Error while fetching events using code exapmple

```
let subscriptionId = transactionReceipt.events[0].args.subId
```

```
$ yarn hardhat deploy
yarn run v1.22.22
$ /Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/.bin/hardhat deploy
Nothing to compile
Local network detected! Deploying mocks...
deploying "VRFCoordinatorV2Mock" (tx: 0xe96fe7c9819b476c12ecda8762a987c84eb2a5ef67f1a7fda46dd5bfcdb4d0e3)...: deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3 with 2967903 gas
Mocks Deployed...
-----------------------------------------------------
An unexpected error occurred:

Error: ERROR processing /Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/deploy/01-deploy-raffle.js:
TypeError: Cannot read properties of undefined (reading '0')
    at Object.module.exports [as func] (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/deploy/01-deploy-raffle.js:19:51)
    at DeploymentsManager.executeDeployScripts (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat-deploy/src/DeploymentsManager.ts:1212:22)
    at DeploymentsManager.runDeploy (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat-deploy/src/DeploymentsManager.ts:1061:5)
    at SimpleTaskDefinition.action (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat-deploy/src/index.ts:450:5)
    at Environment._runTaskDefinition (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat/src/internal/core/runtime-environment.ts:359:14)
    at Environment.run (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat/src/internal/core/runtime-environment.ts:192:14)
    at SimpleTaskDefinition.action (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat-deploy/src/index.ts:601:32)
    at Environment._runTaskDefinition (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat/src/internal/core/runtime-environment.ts:359:14)
    at Environment.run (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat/src/internal/core/runtime-environment.ts:192:14)
    at SimpleTaskDefinition.action (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat-deploy/src/index.ts:690:5)
    at DeploymentsManager.executeDeployScripts (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat-deploy/src/DeploymentsManager.ts:1215:19)
    at DeploymentsManager.runDeploy (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat-deploy/src/DeploymentsManager.ts:1061:5)
    at SimpleTaskDefinition.action (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat-deploy/src/index.ts:450:5)
    at Environment._runTaskDefinition (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat/src/internal/core/runtime-environment.ts:359:14)
    at Environment.run (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat/src/internal/core/runtime-environment.ts:192:14)
    at SimpleTaskDefinition.action (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat-deploy/src/index.ts:601:32)
    at Environment._runTaskDefinition (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat/src/internal/core/runtime-environment.ts:359:14)
    at Environment.run (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat/src/internal/core/runtime-environment.ts:192:14)
    at SimpleTaskDefinition.action (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat-deploy/src/index.ts:690:5)
    at Environment._runTaskDefinition (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat/src/internal/core/runtime-environment.ts:359:14)
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

### Problem in deploy.js

```
subscriptionId = transactionReceipt.events[0].args.subId
```

### Solution

<span style="color:green; font-weight:bold">Parse the transaction log for particular event by its name and look for the indexed event parameter.</span>

```
// Find the SubscriptionCreated event
const parsedLogs = transactionReceipt.logs.map((log) =>
    vrfCoordinatorV2Mock.interface.parseLog(log),
)

const subscriptionCreatedEvent = parsedLogs.find(
    (log) => log.name === "SubscriptionCreated",
)

if (subscriptionCreatedEvent) {
    // Accessing the subId correctly based on the event structure
    subscriptionId = subscriptionCreatedEvent.args.subId
    // console.log("Subscription ID:", subID) // Ensure to convert to string if necessary
} else {
    console.error("SubscriptionCreated event not found or parsed incorrectly.")
}
```

### Output after solution

```
$ yarn hardhat deploy
yarn run v1.22.22
$ /Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/.bin/hardhat deploy
Nothing to compile
Local network detected! Deploying mocks...
deploying "VRFCoordinatorV2Mock" (tx: 0xe96fe7c9819b476c12ecda8762a987c84eb2a5ef67f1a7fda46dd5bfcdb4d0e3)...: deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3 with 2967903 gas
Mocks Deployed...
-----------------------------------------------------
deploying "Raffle" (tx: 0xb9f3388306fc2edb56ae14ce0ec04fd520098a0f3b1d7015eb58783ff498f017)...: deployed at 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 with 1212108 gas
----------------------------------------------------------
✨  Done in 5.09s.
```

##

## <span style="color:red; font-weight:bold">3. Error: No Contract deployed with name: VRFCoordinatorV2Mock</span>

```
yarn hardhat test
```

### Error generated after running test command.

```
Raffle Unit Test
    Constructor
      1) "before each" hook for "Constructor: Initializes the raffle correctly"


  0 passing (1s)
  1 failing

  1) Raffle Unit Test
       "before each" hook for "Constructor: Initializes the raffle correctly":
     ERROR processing /Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/deploy/01-deploy-raffle.js:
Error: No Contract deployed with name: VRFCoordinatorV2Mock
    at getContract (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/@nomiclabs/hardhat-ethers/src/helpers.ts:149:11)
    at Object.module.exports [as func] (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/deploy/01-deploy-raffle.js:15:32)
    at DeploymentsManager.executeDeployScripts (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat-deploy/src/DeploymentsManager.ts:1212:22)
    at DeploymentsManager.runDeploy (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat-deploy/src/DeploymentsManager.ts:1061:5)
    at Object.fixture (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat-deploy/src/DeploymentsManager.ts:316:9)
    at Context.<anonymous> (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/test/unit/Raffle.test.js:13:15)
  Error: ERROR processing /Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/deploy/01-deploy-raffle.js:
  Error: No Contract deployed with name: VRFCoordinatorV2Mock
      at getContract (node_modules/@nomiclabs/hardhat-ethers/src/helpers.ts:149:11)
      at Object.module.exports [as func] (deploy/01-deploy-raffle.js:15:32)
      at DeploymentsManager.executeDeployScripts (node_modules/hardhat-deploy/src/DeploymentsManager.ts:1212:22)
      at DeploymentsManager.runDeploy (node_modules/hardhat-deploy/src/DeploymentsManager.ts:1061:5)
      at Object.fixture (node_modules/hardhat-deploy/src/DeploymentsManager.ts:316:9)
      at Context.<anonymous> (test/unit/Raffle.test.js:13:15)
      at DeploymentsManager.executeDeployScripts (node_modules/hardhat-deploy/src/DeploymentsManager.ts:1215:19)
      at DeploymentsManager.runDeploy (node_modules/hardhat-deploy/src/DeploymentsManager.ts:1061:5)
      at Object.fixture (node_modules/hardhat-deploy/src/DeploymentsManager.ts:316:9)
      at Context.<anonymous> (test/unit/Raffle.test.js:13:15)
```

### Problem found in deploy script 00-deploy-mocks.js file.

```
module.exports.tag = ["all", "mocks"]
```

<span style="color:green; font-weight:bold">module.exports.tag is wrong it should be module.exports.tags</span>

```
module.exports.tags = ["all", "mocks"]
```

## <span style="color:red; font-weight:bold">4. Error [ERR_REQUIRE_ESM]: require() of ES Module</span>

```
yarn hardhat test
```

### Error

```
yarn hardhat test
yarn run v1.22.22
$ /Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/.bin/hardhat test
An unexpected error occurred:

Error [ERR_REQUIRE_ESM]: require() of ES Module /Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/chai/chai.js from /Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/test/unit/Raffle.test.js not supported.
Instead change the require of chai.js in /Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/test/unit/Raffle.test.js to a dynamic import() which is available in all CommonJS modules.
    at Object.<anonymous> (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/test/unit/Raffle.test.js:3:20)
    at /Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/mocha/lib/mocha.js:414:36
    at Array.forEach (<anonymous>)
    at Mocha.loadFiles (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/mocha/lib/mocha.js:411:14)
    at Mocha.run (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/mocha/lib/mocha.js:972:10)
    at testFailures (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat/builtin-tasks/test.js:102:15)
    at new Promise (<anonymous>)
    at SimpleTaskDefinition.action (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat/builtin-tasks/test.js:101:32)
    at async Environment._runTaskDefinition (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat/internal/core/runtime-environment.js:228:20)
    at async Environment.run (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat/internal/core/runtime-environment.js:91:24)
    at async SimpleTaskDefinition.action (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat/builtin-tasks/test.js:127:26)
    at async Environment._runTaskDefinition (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat/internal/core/runtime-environment.js:228:20)
    at async Environment._runTaskDefinition (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat/internal/core/runtime-environment.js:228:20)
    at async OverriddenTaskDefinition._action (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat-gas-reporter/dist/index.js:82:5)
    at async Environment._runTaskDefinition (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat/internal/core/runtime-environment.js:228:20)
    at async Environment.run (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat/internal/core/runtime-environment.js:91:24)
    at async main (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/hardhat/internal/cli/cli.js:224:13) {
  code: 'ERR_REQUIRE_ESM'
```

### Problem

Due to version of chai. Version of chai needed "chai": "^4.2.0" but "chai": "^5.1.1" was installed.

### Solution

<span style="color:green; font-weight:bold">chai version 4.2.0 was installed</span>

```
yarn add --dev chai@^4.2.0
```

### Output after installing chai@^4.2.0

```
yarn hardhat test
yarn run v1.22.22
$ /Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/.bin/hardhat test


  Raffle Unit Test
    Constructor
      ✔ Constructor: Initializes the raffle correctly


  1 passing (1s)

✨  Done in 4.57s.
```

## <span style="color:red; font-weight:bold">5. TypeError: Cannot read properties of undefined (reading 'JsonRpcProvider')</span>

### Error description

This error occurs when there is a mitchmatch in versoin of package installed or some packages are not installed.
In this case there was some mitch match in some package version. All the packages were latest pacakages.

```
An unexpected error occurred:

TypeError: Cannot read properties of undefined (reading 'JsonRpcProvider')
    at Object.<anonymous> (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/@nomiclabs/hardhat-ethers/src/internal/ethers-provider-wrapper.ts:4:61)
    at Module._compile (node:internal/modules/cjs/loader:1364:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1422:10)
    at Module.load (node:internal/modules/cjs/loader:1203:32)
    at Function.Module._load (node:internal/modules/cjs/loader:1019:12)
    at Module.require (node:internal/modules/cjs/loader:1231:19)
    at require (node:internal/modules/helpers:177:18)
    at Object.<anonymous> (/Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-lottery-fcc/smartcontract/node_modules/@nomiclabs/hardhat-ethers/src/internal/provider-proxy.ts:9:1)
    at Module._compile (node:internal/modules/cjs/loader:1364:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1422:10)
```

### Solution

<span style="color:green"> Insltall packages with specific version from the source of project or install all the latest versions and follow the documentations of ethers to use particular as per latest changes. </span>

<span style="color:green"> In this case packages with specific version were installed as shown below </span>

```
yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers@^0.3.0-beta.13
yarn add --dev @nomiclabs/hardhat-etherscan@^3.0.0
yarn add --dev @nomiclabs/hardhat-waffle@^2.0.1
yarn add --dev chai@^4.3.4
yarn add --dev ethereum-waffle@^3.4.0
yarn add --dev ethers@^5.5.1
yarn add --dev hardhat@^2.6.7
yarn add --dev hardhat-contract-sizer@^2.4.0
yarn add --dev hardhat-deploy@^0.9.29
yarn add --dev hardhat-gas-reporter
yarn add --dev prettier
yarn add --dev prettier-plugin-solidity
yarn add --dev solhint
yarn add --dev solidity-coverage
yarn add --dev dotenv
```
