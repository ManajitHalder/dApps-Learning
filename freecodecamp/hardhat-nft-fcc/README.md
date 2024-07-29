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