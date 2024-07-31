// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

error RandomIpfsNft__RangeOutOfBounds();
error RandomIpfsNft__NeedMoreETHSent();
error RandomIpfsNft__TransferFailed();

contract RandomIpfsNft is VRFConsumerBaseV2, ERC721URIStorage, Ownable {
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
    string[] internal s_dogTokenURIs;
    uint256 internal immutable i_mintFee;

    // Events
    event NftRequested(uint256 indexed requestId, address requester);
    event NftMinted(Breed indexed dogBreed, address minter);

    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 keyHash,
        uint32 callbackGasLimit,
        string[3] memory dogTokenURIs,
        uint256 mintFee,
        address initialOwner
    )
        VRFConsumerBaseV2(vrfCoordinatorV2)
        ERC721("Random IPFS NFT", "RIN")
        Ownable(initialOwner)
    {
        i_vrfCoordinatorV2 = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_subscriptionId = subscriptionId;
        i_keyHash = keyHash;
        i_callbackGasLimit = callbackGasLimit;

        s_tokenCounter = 0;
        s_dogTokenURIs = dogTokenURIs;
        i_mintFee = mintFee;
    }

    // NFT Function
    function requestNft() public payable returns (uint256) {
        if (msg.value < i_mintFee) {
            revert RandomIpfsNft__NeedMoreETHSent();
        }

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
        emit NftRequested(requestId, msg.sender);

        return requestId;
    }

    // Chainlink VRF Function
    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        address dogOwner = s_requestIdToSender[requestId];
        uint256 newTokenId = s_tokenCounter;
        s_tokenCounter += 1;

        uint256 moddedRng = randomWords[0] % MAX_CHANCE_VALUE;
        /*
        moddedRng value:
        0 - 10: PUG
        10 - 30: Shiba Inu
        30 - 100: St. Bernard
        */
        Breed dogBreed = getBreedFromModdedRng(moddedRng);
        _safeMint(dogOwner, newTokenId);
        _setTokenURI(newTokenId, s_dogTokenURIs[uint256(dogBreed)]);
        emit NftMinted(dogBreed, dogOwner);
    }

    function getBreedFromModdedRng(
        uint256 moddedRng
    ) public pure returns (Breed) {
        uint256 cumulativeSum = 0;
        uint256[3] memory chanceArray = getChanceArray();
        for (uint256 i = 0; i < chanceArray.length; ++i) {
            if (
                moddedRng < cumulativeSum &&
                moddedRng > cumulativeSum + chanceArray[i]
            ) {
                return Breed(i);
            }
            cumulativeSum += chanceArray[i];
        }
        /*
        Case 1: moddedRng = 9 (0 to 9), i = 0, cummulativeSum = 0, return will be Breed[0] (PUG)
                after 1st iteration: 9 < 0 && 9 < 0 + 10 (chanceArray[0])
        case 2: moddedRng = 24 (10 to 29), i = 1, cummuulativeSum = 40, return will be Breed[1] (SHIBA_INU)
                after 2nd iteration: 24 > 10 && 24 < 10 + 30 (chanceArray[1])
        case 3: moddedRng = 45 (30 to 99), i = 2, cummuulativeSum = 100, return will be Breed[2] (ST_BERNARD)
                after 3rd iteration: 45 > 40 && 45 < 30 + 100 (chanceArray[2])
        */

        revert RandomIpfsNft__RangeOutOfBounds();
    }

    // Mint function
    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) {
            revert RandomIpfsNft__TransferFailed();
        }
    }

    function getChanceArray() public pure returns (uint256[3] memory) {
        return [10, 30, MAX_CHANCE_VALUE];
    }

    // function tokenURI(uint256) public view override returns (string memory) {}

    function getMintFee() public view returns (uint256) {
        return i_mintFee;
    }

    function getDogTokenURIs(
        uint256 index
    ) public view returns (string memory) {
        return s_dogTokenURIs[index];
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
