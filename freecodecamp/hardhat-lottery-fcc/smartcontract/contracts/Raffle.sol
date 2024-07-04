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