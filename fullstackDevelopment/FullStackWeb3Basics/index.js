import { ethers } from './ethers-5.6.esm.min.js';
// import ethers from "ethers"
// const { ethers } = require('ethers');

const connectButton = document.getElementById('connectButton');
const executeButton = document.getElementById('executeButton');

connectButton.onclick = connect;
executeButton.onclick = execute;

async function connect() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Metamask found!!!');
    } catch (error) {
      console.log(error);
    }
  } else {
    connectButton.innerHTML = 'Please install metamask!!!';
  }
}

const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';
const abi = [
  {
    inputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: '_favoriteNumber',
        type: 'uint256',
      },
    ],
    name: 'addPerson',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
    ],
    name: 'getFavoriteNumberByName',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'people',
    outputs: [
      {
        internalType: 'uint256',
        name: 'favoriteNumber',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'retrieve',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_favoriteNumber',
        type: 'uint256',
      },
    ],
    name: 'store',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

async function execute() {
  /* 
  We need the following to execute a function using ethers:
  
  1. node coonection (run yarn hardhat node)

  2.deployed contract address (0x5fbdb2315678afecb367f032d93f642f64180aa3)
    Get the address after deployment using command:
    yarn hardhat run scripts/deploy.js --network localhost

  3. contract ABI (blueprint to interact with a contract. 
    Copy it from artifacts/contracts/SimpleStorage.json)
  
  4. function (to call a function on the contract)
    Call store function
  */

  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum); // metamask is going to be provider
    const signer = provider.getSigner(); // this is going to get the connected account
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionResponse = await contract.store(23);
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  } else {
    executeButton.innerHTML = 'Please install metamask!!!';
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);
  return new Promise((resolve, reject) => {
    try {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(
          `Completed with ${transactionReceipt.confirmations} confirmations`
        );
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}

// export default {
//   connect,
//   execute,
// };
