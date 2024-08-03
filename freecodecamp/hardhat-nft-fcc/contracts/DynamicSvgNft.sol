// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract DynamicSvgNft is ERC721 {
    /* 
     What's in this contract:
     Mint
     Store SVG information somewhere
     Implement some logic to say "Show X Image" or "Show Y Image"
    */

    uint256 private s_tokenCounter;
    string private immutable i_lowImageURI;
    string private immutable i_highImageURI;

    constructor(
        string memory logSvg,
        string memory highSvg
    ) ERC721("Dynamic SVG NFT", "DSN") {
        s_tokenCounter = 0;
    }

    function convertSvgToImageURI() {}

    function mintNft() public {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter += 1;
    }
}
