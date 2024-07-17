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

/\*
We need the following to execute a function using ethers:

1. node coonection (run yarn hardhat node)

2.deployed contract address (0x5fbdb2315678afecb367f032d93f642f64180aa3)
Get the address after deployment using command:
yarn hardhat run scripts/deploy.js --network localhost

3. contract ABI (blueprint to interact with a contract.
   Copy it from artifacts/contracts/SimpleStorage.json)

4. function (to call a function on the contract)
   Call store function
   \*/
