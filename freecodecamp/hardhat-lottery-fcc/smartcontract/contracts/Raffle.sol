// Feature provided by the contract:
// -   User the participates the lottery by paying some amount
// -   Lottery picks a random winner (varifiable random winner by using Chainlink VRF)
// -   Winner to be selected at certian interval (minutes/days/months/etc) using completely automated process.
// -   Contract uses Chainlink Oracles for Randomness (VRF) and Automated execution (Automation)

// Refer the following url for Chainlink VRF:
// -   https://docs.chain.link/vrf/v2/subscription/examples/get-a-random-number
// -   Function for VRF: requestRandomWords(/* , , , , */) and fulfillRandomWords(/* , */)

// Refer the following url for Chainlink Automation:
// -   https://docs.chain.link/chainlink-automation/guides/compatible-contracts
// -   Function for Automation: checkUpkeep(/* */) and performUpkeep(/* */)

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
    uint256 private immutable i_subscriptionId;
    uint16 private constant MINIMUM_REQUEST_CONFIRMATIONS = 3;
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
    event RequestedRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    /* Functions */
    constructor(
        address vrfCoordinatorV2, // contract (need to deply this contract)
        uint256 entranceFee, 
        bytes32 gasLane, 
        uint256 subscriptionId,
        uint32 callbackGasLimit,
        uint256 interval
        ) VRFConsumerBaseV2(vrfCoordinatorV2) 
    {
        // Chainlink VRF
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_entranceFee = entranceFee;
        i_gasLane = gasLane;            
        i_subscriptionId = uint256(keccak256(abi.encodePacked(subscriptionId)));
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
    ) public override returns (
        bool upkeepNeeded, 
        bytes memory performData) {
            bool isOpen = (s_raffleState == RaffleState.OPEN);
            bool timepassed =  ((block.timestamp - s_lastBlockTimestamp) > i_interval);
            bool hasPlayers = (s_players.length > 0);
            bool hasBalance = (address(this).balance > 0);
            
            upkeepNeeded = (isOpen && timepassed && hasPlayers && hasBalance);
            performData = "";
            
            return (upkeepNeeded, performData);
    }

    /** 
     * @dev This function is triggered after checkUpkeep returns true for upkeepNeeded. This function
     * will be executed onchain unlike checkUpkeep() function which is executed offchain.
     * The chainlink perform actual computation here, getting random word using chainlink VRF to get a
     * random winner.
     */
    function performUpkeep(bytes calldata /* performData */) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) { revert Raffle__UpkeepNotNeeded(address(this).balance, s_players.length, uint256(s_raffleState)); }

        s_raffleState = RaffleState.CALCULATING;

        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            uint64(i_subscriptionId),
            MINIMUM_REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        emit RequestedRaffleWinner(requestId);
    }

    /**
     * @dev This function is called by Chainlink VRF to send money to the random winner.
     */
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

    /* Getter functions */
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

    function getLastTimestamp() public view returns (uint256) {
        return s_lastBlockTimestamp;
    }

    function getInterval() public view returns (uint256) {
        return i_interval;
    }

    function getRequestConfirmations() public pure returns (uint256) {
        return MINIMUM_REQUEST_CONFIRMATIONS;
    }

    function getSubscriptionId() public view returns (uint64) {
        return uint64(i_subscriptionId);
    }
}