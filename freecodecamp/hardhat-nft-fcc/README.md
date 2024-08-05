# NFT (Non Fungible Token), ERC-721 (Ethereum Request for Comments 721)

We are going to implement 3 different NFT's here:

-   Basic NFT
-   Random IPFS hosted NFT
-   Dynamic SVG NFT (hosted on-chain)

## Installations and Setups for the project

```
yarn add --dev hardhat
```

-   Copy from previous projects:

    -   .env
    -   .gitignore
    -   .prettierrc
    -   .prettierignore
    -   hardhat.config.js

-   Install the packages

```
yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle chai ethereum-waffle hardhat hardhat-contract-sizer hardhat-deploy hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage dotenv
```

## Basic NFT

Create a BasicNft.sol file inside ./contracts folder

Add Openzeppelin/contracts

```
yarn add --dev @openzeppelin/contracts
```

## Deploy BasicNft

-   Write ./deploy/01-deploy-basic-nft.js
-   Write ./utils/verify.js
-   Write ./helper.hardhat.config.js

Deploy BasicNft

```
yarn hardhat deploy

```

```
yarn run v1.22.22
warning package.json: No license field
$ /Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-nft-fcc/node_modules/.bin/hardhat deploy
Nothing to compile
--------------------------------------------------------------------------
deploying "BasicNft" (tx: 0xd1fb7e58e72993f2cd7d036f3616fb29ca7bf61dc57daeeb02a9ee6f61acc9f4)...: deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3 with 1668650 gas
--------------------------------------------------------------------------
✨  Done in 6.06s.
```

## Formatting files

### Formatting javascript files:

Command to format a js file

```
Shift + Option + F
```

Install prettier for VS Code and add the following setting in "Preferences: Open User Setting (JSON)"

```
Command + Shift + P
```

Select "Preferences: Open User Setting (JSON)" and make keep the javascript changes same:

```
{
  "workbench.colorTheme": "Default High Contrast",
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "files.autoSave": "afterDelay",
  "git.openRepositoryInParentFolders": "never",
  "[solidity]": {
    "editor.defaultFormatter": "JuanBlanco.solidity"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "remote.SSH.remotePlatform": {
    "*.gitpod.io": "linux"
  },
  "prettier.singleQuote": true,
  "editor.minimap.size": "fit",
  "editor.acceptSuggestionOnEnter": "off",
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "prettier.requireConfig": true
}
```

## Formatting solidity files

In addition to the above

Install the package "prettier-plugin-solidity"

```
yarn add --dev prettier-plugin-solidity
```

And install "JuanBlanco.solidity" by typing "Shift + Option + F" to format the file and install it. Or install it by running the command

```
code --install-extension JuanBlanco.solidity
```

And add the following changes in "Preferences: Open User Setting (JSON)" file:

```
"[solidity]": {
    "editor.defaultFormatter": "JuanBlanco.solidity"
  },
```

Keep the content of .pretiterrc as following:

```
{
    "tabWidth": 4,
    "useTabs": false,
    "semi": false,
    "singleQuote": false,
    "plugins": ["prettier-plugin-solidity"]
}
```

## Random IPFS hosted NFT

When we mint and NFT, we will trigger a Chainlink VRF call to get us a random number.
Using that number we will get a random NFT.
NFTs: Pug, Shiba Inu, St. Bernard
Pug super rare
Shiba sort of rare
St. bernard common

    Users have to pay to mint an NFT
    The owner of the contract can withdraw the ETH

## Working with images

get the IPFS hashes of our images

1. With our own IPFS nodel. https: //docs. ipfs. io/
2. pinata: //www.pinata.cloud/
3. nft.storage https://nft.storage/

### Uploading images to pinata.cloud programmatically

Create account on pinata.cloud

Install @pinata/sdk

```
yarn add --dev @pinata/sdk
```

Install path package to work with paths

```
yarn add --dev path
```

## Dynamic SVG NFT

Functionalities of DynamicSvgNft contract

-   Mint
-   Store SVG information somewhere
-   Implement some logic to say "Show X Image" or "Show Y Image"

### Base64 Encoding

github path of frown.svg: images/dynamicNft/frown.svg
code of frwon.svg:

```
<?xml version="1.0" standalone="no"?>
<svg width="1024px" height="1024px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <path fill="#333" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"/>
  <path fill="#E6E6E6" d="M512 140c-205.4 0-372 166.6-372 372s166.6 372 372 372 372-166.6 372-372-166.6-372-372-372zM288 421a48.01 48.01 0 0 1 96 0 48.01 48.01 0 0 1-96 0zm376 272h-48.1c-4.2 0-7.8-3.2-8.1-7.4C604 636.1 562.5 597 512 597s-92.1 39.1-95.8 88.6c-.3 4.2-3.9 7.4-8.1 7.4H360a8 8 0 0 1-8-8.4c4.4-84.3 74.5-151.6 160-151.6s155.6 67.3 160 151.6a8 8 0 0 1-8 8.4zm24-224a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"/>
  <path fill="#333" d="M288 421a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm224 112c-85.5 0-155.6 67.3-160 151.6a8 8 0 0 0 8 8.4h48.1c4.2 0 7.8-3.2 8.1-7.4 3.7-49.5 45.3-88.6 95.8-88.6s92 39.1 95.8 88.6c.3 4.2 3.9 7.4 8.1 7.4H664a8 8 0 0 0 8-8.4C667.6 600.3 597.5 533 512 533zm128-112a48 48 0 1 0 96 0 48 48 0 1 0-96 0z"/>
</svg>
```

But we need the image URI.

How do we convert the code of frown.svg to image URI?

We can convert the svg to image URI on chain using a function.

### Convert SVG to Base64

https://base64.guru/converter/encode/image/svg

DataType: Remote URL
Remote URL: https://raw.githubusercontent.com/PatrickAlphaC/hardhat-nft-fcc/dd592fb4e8e222db70128fccbfeadd3a0a248bcd/images/dynamicNft/happy.svg

Click SVG to Base64:

Output:

```
PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgd2lkdGg9IjQwMCIgIGhlaWdodD0iNDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgZmlsbD0ieWVsbG93IiByPSI3OCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgPGcgY2xhc3M9ImV5ZXMiPgogICAgPGNpcmNsZSBjeD0iNjEiIGN5PSI4MiIgcj0iMTIiLz4KICAgIDxjaXJjbGUgY3g9IjEyNyIgY3k9IjgyIiByPSIxMiIvPgogIDwvZz4KICA8cGF0aCBkPSJtMTM2LjgxIDExNi41M2MuNjkgMjYuMTctNjQuMTEgNDItODEuNTItLjczIiBzdHlsZT0iZmlsbDpub25lOyBzdHJva2U6IGJsYWNrOyBzdHJva2Utd2lkdGg6IDM7Ii8+Cjwvc3ZnPg==
```

To covert the output to image, type the following + code on browser address bar:

```
data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgd2lkdGg9IjQwMCIgIGhlaWdodD0iNDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgZmlsbD0ieWVsbG93IiByPSI3OCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgPGcgY2xhc3M9ImV5ZXMiPgogICAgPGNpcmNsZSBjeD0iNjEiIGN5PSI4MiIgcj0iMTIiLz4KICAgIDxjaXJjbGUgY3g9IjEyNyIgY3k9IjgyIiByPSIxMiIvPgogIDwvZz4KICA8cGF0aCBkPSJtMTM2LjgxIDExNi41M2MuNjkgMjYuMTctNjQuMTEgNDItODEuNTItLjczIiBzdHlsZT0iZmlsbDpub25lOyBzdHJva2U6IGJsYWNrOyBzdHJva2Utd2lkdGg6IDM7Ii8+Cjwvc3ZnPg==
```

Output is the Smily image:

The above link becomes our image URI. We can use the above way to convert SVG to image URI on chain.

### Encode on chain SVG to base64

Use github code: https://github.com/Brechtpd/base64

Add as package:

```
yarn add --dev base64-sol
```

import "base64-sol/base64.sol"