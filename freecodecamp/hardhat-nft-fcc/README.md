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


