# Defi Aave

## Initial setups and installations

Create folder smartcontract
Create README.md file

Install hardhat

```
yarn add --dev hardhat
```

Create a hardhat project and select "Create an empty hardhat.config.js"

```
yarn hardhat
```

Install devepdencies

```
yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle chai ethereum-waffle hardhat hardhat-contract-sizer hardhat-deploy hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage dotenv
```

### Weth Token URLs

_[Weth Token Sepolia Etherscan](https://sepolia.etherscan.io/address/0xdd13E55209Fd76AfE204dBda4007C227904f0a81#code)_

_[Weth Token Mainnet](https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)_

## Forking mainnet

Create a new app in alchemy.com https://dashboard.alchemy.com/apps

Copy the Ethereum mainnet url, paste it into hardhat.config.js file:

hardhat: {
chainId: 31337,
forking: {
url: MAINNET_RPC_URL,
},
}

This will form the mainnet after finding forking and MAINNET_RPC_URL url.

## Run script to get lending pool address and IWeth value

```
yarn hardhat run scripts/aaveBorrow.js --network hardhat
```

or

```
yarn hardhat run scripts/aaveBorrow.js
```

## More about DApps

[Speedrun Ethereum](https://speedrunethereum.com/)

## Execution

```
yarn hardhat run scripts/aaveBorrow.js --network hardhat
```

```
yarn run v1.22.22
warning package.json: No license field
$ /Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-defi-fcc/node_modules/.bin/hardhat run scripts/aaveBorrow.js --network hardhat
getWeth: Got 0.02 WETH
aaveBorrow: Lending pool address 0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9
Approved!
Depositing...
Deposited!

You have 20000000000000000 worth of ETH deposited in your Account
You have 0 worth of ETH borrowed
You can borrow 16500000000000000 worth of ETH
Your current liquidation threshold is 8600
Your account health factor is 115792089237316195423570985008687907853269984665640564039457584007913129639935

The DAI/ETH price is 299735662692509
You can borrow 52.296079349358486 DAI
You can borrow 52296079349358486000 DAI in WEI
You have borrowed!!!

You have 20000000042730985 worth of ETH deposited in your Account
You have 15650745375544875 worth of ETH borrowed
You can borrow 849254659708188 worth of ETH
Your current liquidation threshold is 8600
Your account health factor is 1098989193423628570

Approved!

Repayed!!!

You have 20000000085461971 worth of ETH deposited in your Account
You have 466173128 worth of ETH borrowed
You can borrow 16499999604332998 worth of ETH
Your current liquidation threshold is 8600
Your account health factor is 36896163764929185278993602

✨  Done in 43.54s.
```
