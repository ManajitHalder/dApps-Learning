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


