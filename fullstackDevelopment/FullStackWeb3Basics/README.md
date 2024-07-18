# Creating front-end for smart contract, connect and execute functions on an existing smart contract

## Install yarn

```
yarn
```

## Install hardhat

```
yarn add --dev hardhat
```

## Create index.html file to connect, execute on ethers

### Add a function to connect to metamask

```
</head>
  <body>
    Web3 Basics. Ethereum.request.
    <script>
      async function connect() {
        if (typeof window.ethereum !== 'undefined') {
          console.log('Metamask found!!!');
          await window.ethereum.request({ method: 'eth_requestAccounts' });
        }
      }
    </script>
    <button id="connectButton" onclick="connect()">Connect</button>
  </body>
```

### Execute command using ethers library

To execute first install ethers

```
yarn add ethers
```

## Using hardhat-simple-storage-fcc contract for executing functions on ethereum

path of contract project: dAppLearned/freecodecamp/hardhat-simple-storage-fcc

## We need the following to execute a function using ethers:

- node coonection (run yarn hardhat node)
- deployed contract address (0x5fbdb2315678afecb367f032d93f642f64180aa3)
  Get the address after deployment using command:
  yarn hardhat run scripts/deploy.js --network localhost
- contract ABI (blueprint to interact with a contract.
  Copy it from artifacts/contracts/SimpleStorage.json)
- function (to call a function on the contract)
  Call store function

##

# Best resources for Full Stack Web3 Templates

##

## Scaffold-eth

- Github url:
  - [https://github.com/scaffold-eth/scaffold-eth]
- Description:
  - Provides boilerplate code to quickly experiment with Solidity using a frontend that adapts to smart contract.
  - Different flavors of scaffold-eth using typescript, tailwind, nextjs, chakra and more.
  - Some important Solidity learning content urls and informations.

## ethereum boilerplate

- Github url:
  - [https://github.com/ethereum-boilerplate/ethereum-boilerplate]
- Description:
  - You need active web3 provider/wallet only for authentication. All pages in this boilerplate do not require an active web3 provider, they use Moralis Web3 API. Moralis supports the most popular blockchains and their test networks.

## create-eth-app

- Github url:
  - [https://github.com/WalletConnect/create-eth-app]
- Description:
  - Create Ethereum-powered apps with one command.
  - Create Eth App is a great fit for:
    - Learning how to write Ethereum-powered apps in a comfortable and feature-rich development environment.
    - Starting new Ethereum-powered single-page React applications without wasting time on copy-pasting boilerplates
    - Creating examples with React for your Ethereum-related libraries and components.
