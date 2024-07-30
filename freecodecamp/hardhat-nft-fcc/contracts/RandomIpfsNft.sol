// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
// import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract RandomIpfsNft is VRFConsumerBaseV2, ERC721 {
    /* 
    When we mint and NFT, we will trigger a Chainlink VRF call to get us a random number.
    Using that number we will get a random NFT.
    NFTs: Pug, Shiba Inu, St. Bernard
    Pug super rare
    Shiba sort of rare
    St. bernard common

    Users have to pay to mint an NFT
    The owner of the contract can withdraw the ETH
    */

    // Type Declaration
    enum Breed {
        PUG,
        SHIBA_INU,
        ST_BERNARD
    }

    // Chainlink VRF variables/constants
    VRFCoordinatorV2Interface private immutable i_vrfCoordinatorV2;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_keyHash;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    // VRF Helpers
    mapping(uint256 => address) public s_requestIdToSender;

    // NFT Variables
    uint256 private s_tokenCounter;
    uint256 internal constant MAX_CHANCE_VALUE = 100;

    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 keyHash,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) ERC721("Random IPFS NFT", "RIN") {
        i_vrfCoordinatorV2 = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_subscriptionId = subscriptionId;
        i_keyHash = keyHash;
        i_callbackGasLimit = callbackGasLimit;

        s_tokenCounter = 0;
    }

    // NFT Function
    function requestNft() public returns (uint256) {
        return requestRandomWords();
    }

    // NFT Function
    function mintNft() public {}

    // Chainlink VRF Function
    function requestRandomWords() internal returns (uint256 requestId) {
        requestId = i_vrfCoordinatorV2.requestRandomWords(
            i_keyHash,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        s_requestIdToSender[requestId] = msg.sender;
        return requestId;
    }

    // Chainlink VRF Function
    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        address dogOwner = s_requestIdToSender[requestId];
        uint256 newTokenId = s_tokenCounter;
        _safeMint(dogOwner, newTokenId);

        uint256 moddedRng = randomWords[0] % MAX_CHANCE_VALUE;
        /*
        moddedRng value:
        0 - 10: PUG
        10 - 30: Shiba Inu
        30 - 100: St. Bernard
        */
    }

function getBreedFromModdedRng(uint256 moddedRng) public pure returns (Breed) {
    uint256 cumulativeSum = 0;
    uint
}

    function getChanceArray() public pure returns (uint256[3] memory) {
        return [10, 30, MAX_CHANCE_VALUE];
    }

    function tokenURI(uint256) public view override returns (string memory) {}

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
