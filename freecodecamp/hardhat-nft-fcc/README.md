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
