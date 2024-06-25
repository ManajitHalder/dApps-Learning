# Hardhat Installation and Usage on Mac OS

[Github link of this project by Patrick Collins & FCC](https://github.com/PatrickAlphaC/hardhat-simple-storage-fcc)

[Github link of this project by Manajit Halder](https://github.com/ManajitHalder/dApps-Learning/tree/main/freecodecamp/hardhat-simple-storage-fcc)

[Best readme.md template](https://github.com/othneildrew/Best-README-Template/blob/master/README.md)

Creating a hardhat new hardhat project.

```
$ mkdir hardhat-simple-storage-fcc
$ cd hardhat-simple-storage-fcc
```

Answer all the question of command yarn init:

```
$ yarn init
yarn init v1.22.22
warning ../../../../../package.json: No license field
question name (hardhat-simple-storage-fcc):
question version (1.0.0):
question description:
question entry point (index.js):
question repository url:
question author:
question license (MIT):
question private:
success Saved package.json
✨  Done in 20.39s.
```

```
yarn add --dev hardhat
```

Create a hardhat project:

```
yarn hardhat
```

Compile hardhat project:

```
yarn hardhat compile
```

Clean hardhat project will remove aritifacts folder and its contents:

```
yarn hardhat clean
```

## Code formatting

### Add prettier and prettier-plugin-solidity for code formatting:

```
yarn add --dev prettier prettier-plugin-solidity
```

### Add .prettierrc in project directory

```
touch .prettierrc
```

### Add following contents to .prettierrc file:

```
{
    "tabWidth": 4,
    "useTabs": false,
    "semi": false,
    "singleQuote": false
}
```

### Add file .prettierignore and add files in it to ignore formatting for these files:

```
node_modules
package.json
img
artifacts
cache
coverage
.env
.*
README.md
coverage.json
```

### Wokring with deploy.js:

Command to run deploy.js. First command will be enough, but second is more explicit.

```
yarn hardhat run scripts/deploy.js
yarn hardhat run scripts/deploy.js --network hardhat
```

### .env

Add dotenv package:

```
yarn add --dev dotenv
```

# Verify and Publish Contract

Install hardhat-verify plugins to verify the source of the code of deployed contract.

```
yarn add --dev @nomicfoundation/hardhat-verify
```

Create account in etherscan.io if not created to create API key.

1. Signin to etherscan.io.
2. Select API
3. Click on + Add and click 'Create New API Key'
4. For example: HH-FCC
5. Copy the API key, example '8ZB7WMYWGEAQ915ES9GZ14TYSWAS8V45SY'
6. Paste it in your .env file: 'ETHERSCAN_API_KEY=8ZB7WMYWGEAQ915ES9GZ14TYSWAS8V45SY'

Update hardhat.config.js:

```
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 1337,
        },
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
        },
        localhost: {
            url: "http://localhost:8545",
            chainId: 31337,
        },
    },
    solidity: "0.8.24",
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
}
```

Running command yarn hardhat should display verify in Available tasks:

```
yarn hardhat

verify                Verifies a contract on Etherscan or Sourcify
```

### Code changes for verifying on Sepolia network

scripts/deploy.js:

```
const { ethers, run, network } = require("hardhat")
require("dotenv").config()

async function main() {
    try {
        const SimpleStorageFactory = await ethers.getContractFactory(
            "SimpleStorage"
        )
        console.log("Deploying contract...")
        const simpleStorage = await SimpleStorageFactory.deploy()

        // console.log(network.config)

        // Deploy to hardhat network (sepolia)
        if (
            network.config.chainId === 11155111 &&
            process.env.ETHERSCAN_API_KEY
        ) {
            console.log("Waiting for block transactions ...")
            await simpleStorage.deploymentTransaction().wait(6)
            await verify(simpleStorage.target, [])
        }

        // Interact with SimpleStorage contract
        const currentValue = await simpleStorage.retrieve()
        console.log(`Current value is ${currentValue}`)


        // Update current value
        const transactionResponse = await simpleStorage.store(423)
        await transactionResponse.wait(1)
        const updatedValue = await simpleStorage.retrieve()
        console.log(`Updated value is ${updatedValue}`)
    } catch (error) {
        console.error("Error deploying contract:", error)
    }
}

// async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified")
        } else {
            console.log(e)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
})

```

hardhat.config.js:

```
require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("@nomicfoundation/hardhat-verify")

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 1337,
        },
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
        },
        localhost: {
            url: "http://localhost:8545",
            chainId: 31337,
        },
    },
    solidity: "0.8.24",
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
}
```

Verify command:

```
$ yarn hardhat run scripts/deploy.js --network sepolia
```

Output of verify:

```
yarn run v1.22.22
$ /Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-simple-storage-fcc/node_modules/.bin/hardhat run scripts/deploy.js --network sepolia
Deploying contract...
Waiting for block transactions ...
Verifying contract...
Successfully submitted source code for contract
contracts/SimpleStorage.sol:SimpleStorage at 0xF7C2aC4677AB488630c9c2bBF88B3171E4c52671
for verification on the block explorer. Waiting for verification result...

Successfully verified contract SimpleStorage on the block explorer.
https://sepolia.etherscan.io/address/0xF7C2aC4677AB488630c9c2bBF88B3171E4c52671#code

Current value is 0
Updated value is 423
✨  Done in 86.62s.
```

Check the url for your deployed code:

_[Verify contract SimpleStorage on the block explorer](https://sepolia.etherscan.io/address/0xF7C2aC4677AB488630c9c2bBF88B3171E4c52671#code)_

-   You should see your contract code deployed under section "Contract Source Code"

# Tasks in hardhat

A task is a JavaScript async function with some associated metadata.

Running 'yarn hardhat' command lists available tasks provided by hardhat.

_[Writing tasks](https://hardhat.org/hardhat-runner/docs/guides/tasks)_

Write a simple task to get the current block number:

1. Create a folder tasks
2. Create a java script file block-number.js and define the task

```
const { task } = require("hardhat/config")

task("block-number", "Prints the current block number").setAction(
    async (taskArgs, hre) => {
        const blockNumber = await hre.ethers.provider.getBlockNumber()
        console.log(`Current block number is ${blockNumber}`)
    }
)
```

3. Running 'yarn hardhat' won't list the block-number task yet. Update hardhat.config.js as follows to list the task:

```
require("./tasks/block-number")
```

# Running network localhost

1. To run deploy.js in localhost first run the local hardhat node in a separate bash shell.

```
$ yarn hardhat node
```

2. Add localhost url and chainId details in hardhat.config.js file:

```
localhost: {
    url: "http://127.0.0.1:8545/",
    chainId: 1337,
},
```

3. Run and check the transaction on the terminal where node is running.

```
$ yarn hardhat run scripts/deploy.js --network localhost
```

# Running tests

1. Refer the url to understand how to write test cases to test your contract:

-   _[Testing contracts](https://hardhat.org/tutorial/testing-contracts)_

2. Write test cases. Test case example code for SimpleStorage.sol in file test/SimpleStorage.js

SimpleStorage.sol:

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract SimpleStorage {
    uint256 favoriteNumber;

    struct People {
        uint256 favoriteNumber;
        string name;
    }

    People[] public people;

    mapping(string => uint256) nameToFavoriteNumber;

    function store(uint256 _favoriteNumber) public virtual {
        favoriteNumber = _favoriteNumber;
    }

    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }

    function addPerson(string calldata _name, uint256 _favoriteNumber) public {
        nameToFavoriteNumber[_name] = _favoriteNumber;
        people.push(People(_favoriteNumber, _name));
    }

    function getFavoriteNumberByName(string calldata _name) public view returns (uint256) {
        return nameToFavoriteNumber[_name];
    }
}
```

SimpleStorage.js:

```
const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

describe("SimpleStorage", function () {
    let simpleStorageFactory, simpleStorage
    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
    })

    it("Should start with a favorite number of 0", async function () {
        const currentNumber = await simpleStorage.retrieve()
        const expectedNumber = "0"
        assert.equal(currentNumber.toString(), expectedNumber)
        expect(currentNumber.toString()).to.equal(expectedNumber)
        console.log(`Retrieved number is ${currentNumber}`)
    })

    it("Should update favorite number when store is called", async function () {
        const expectedNumber = "434"
        const transactionResponse = await simpleStorage.store(expectedNumber)
        await transactionResponse.wait(1)

        const currentNumber = await simpleStorage.retrieve()
        assert.equal(expectedNumber, currentNumber.toString())
        console.log(`Stored number is ${expectedNumber}`)
    })

    it("Should add first person and should get the persons favorite number", async function() {
        const firstPersonName = "Reyansh Halder"
        const firstPersonFavoriteNumber = "100"
        const transactionResponse = await simpleStorage.addPerson(firstPersonName, firstPersonFavoriteNumber)
        await transactionResponse.wait(1)

        const retrievedFavoriteNumber = await simpleStorage.getFavoriteNumberByName(firstPersonName)
        expect(firstPersonFavoriteNumber).to.equal(retrievedFavoriteNumber.toString())
        console.log(`${firstPersonName}'s favorite number is ${retrievedFavoriteNumber}`)
    })

    it("Should add second person and should get the persons favorite number", async function() {
        const secondPersonName = "Agastya Halder"
        const secondPersonFavoriteNumber = "200"
        const transactionResponse = await simpleStorage.addPerson(secondPersonName, secondPersonFavoriteNumber)
        await transactionResponse.wait(1)

        const retrievedFavoriteNumber = await simpleStorage.getFavoriteNumberByName(secondPersonName)
        expect(secondPersonFavoriteNumber).to.equal(retrievedFavoriteNumber.toString())
        console.log(`${secondPersonName}'s favirote number is ${retrievedFavoriteNumber}`)
    })
})
```

3. Run test command.

    ```
    $ yarn hardhat test
    ```

4. Test command to run only one test:

-   Using grep:
    Provide a unique word from the test description of the test which you want to run. Suppose unique word in test is "store" and description is "Should update favorite number when store is called", then test command can be written as:

    ```
    yarn hardhat test grep store
    ```

-   Using the keyword .only:
    Write the only test case you want to run using "only" keyword. Test case example and the command to run the only test case:

    Test code example:

    ```
    it("Should start with a favorite number of 0", async function () {
       ...
    })

    it.only("Should update favorite number when store is called", async function () {
        const expectedNumber = "434"
        const transactionResponse = await simpleStorage.store(expectedNumber)
        await transactionResponse.wait(1)

        const currentNumber = await simpleStorage.retrieve()
        assert.equal(expectedNumber, currentNumber.toString())
        console.log(`Stored number is ${expectedNumber}`)
    })

    it("Should add first person and should get the persons favorite number", async function () {
        ....
    }
    ```

    Command:

    ```
    $ yarn hardhat test
    ```

# Hardhat Gas Reporter

Gas Usage Analytics for Hardhat

-   Get gas metrics for method calls and deployments on L1 and L2 by running your test suite.
-   Get national currency costs of deploying and using your contract system.
-   Output data in multiple formats including text, markdown, reStructuredText and JSON.

_[hardhat-gas-reporter package installation and usage details](https://www.npmjs.com/package/hardhat-gas-reporter)_

Follow the above url to install hardhat-gas-reporter package, configuration in hardhat.config.js and usage.

## Install hardhat-gas-reporter package

```
$ yarn add hardhat-gas-reporter --dev
```

## Update hardhat.config.js file with gas reporter changes

-   Update .evn file. Create account in https://pro.coinmarketcap.com/, copy the API key and paste it in .env file.

```
COINMARKETCAP_API_KEY=sd09fsd09f-sd09f-sd09f-sd09f-sd09fsd09fsd09f
```

-   Update hardhat.config.js file

```
const COINMARKET_API_KEY = process.env.COINMARKET_API_KEY

gasReporter: {
enabled: true,
outputFile: "gas-report.txt",
noColors: true,
currency: "USD",
coinmarketcap: COINMARKET_API_KEY,
},
```

# Solidity Coverage

_[Code coverate for Solidity testing](https://github.com/sc-forks/solidity-coverage)_

-   Install solidity-coverage package

```
$ yarn add solidity-coverage --dev
```

-   Changes in hardhat.config.js

```
require("solidity-coverage")
```

-   Test
