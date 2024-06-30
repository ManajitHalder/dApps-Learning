# HARDHAT FUND ME PROJECT

1. Create project and open the project folder in VS Code

    ```
    mkdir hardhat-fund-me-fcc
    cd hardhat-fund-me-fcc
    ```

2. Add hardhat. This will install hardhat and create files/folders package.json, node_modules, yarn.lock.

    ```
    yarn add --dev hardhat
    ```

3. Create a hardhat project

-   Run command
    ```
    yarn hardhat
    ```
-   Select 'Create JavaScript project' and select yes for all prompts.

4. Create .prettierrc with following content to start with the project:

    ```
    {
        "tabWidth": 4,
        "useTabs": false,
        "semi": false,
        "singleQuote": false
    }
    ```

5. Create .prettierignore file with following content to start with the project:

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

6. Install solhint package if not installed by hardhat.

    ```
    yarn add solhint
    ```

7 Create .solhint.json by running the following command. It will create file .solhint.json

    ```
    yarn solhint --init
    ```

8. Update the contents of .solhint.json

    ```
    {
        "extends": "solhint:default",
        "rules": {
            "compiler-version": ["error", "^0.8.0"],
            "func-visibility": ["warn", { "ignoreConstructors": true }]
        }
    }
    ```

9. Create file .solhintignore with content:

    ```
    node_modules
    contracts/test
    ```

10. Add your contract code in contract/ folder. Compile your code.

    ```
    yarn hardhat compile
    ```

11. If you get @chainlink not found error as shown below then add chainlink contracts to your project:

compilation error:

    ```
    $ yarn hardhat compile
    yarn run v1.22.22
    warning package.json: No license field
    $ /Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-fund-me-fcc/node_modules/.bin/hardhat compile
    Error HH404: File @chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol, imported from contracts/PriceConverter.sol, not found.

    For more info go to https://hardhat.org/HH404 or run Hardhat with --show-stack-traces
    error Command failed with exit code 1.
    info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
    ```

Adding chainlink contracts command:

    ```
    yarn add --dev @chainlink/contracts
    ```

# Hardhat deploy

## Details on hardhat-deploy repo:

_[https://www.npmjs.com/package/hardhat-deploy](https://www.npmjs.com/package/hardhat-deploy)_

## Details on hardhat-deploy-ethers repo:

_[https://github.com/wighawag/hardhat-deploy-ethers#readme](https://github.com/wighawag/hardhat-deploy-ethers#readme)_

## Hardhat-deploy explanation:

A Hardhat Plugin For Replicable Deployments And Easy Testing.

This hardhat plugin adds a mechanism to deploy contracts to any network, keeping track of them and replicating the same environment for testing.

It also adds a mechanism to associate names to addresses, so test and deployment scripts can be reconfigured by simply changing the address a name points to, allowing different configurations per network. This also results in much clearer tests and deployment scripts (no more accounts[0] in your code).

## Installation

```
yarn add hardhat-deploy --dev
```

Add require("hardhat-deploy") in hardhat.config.js

```
require("hardhat-deploy")
```

Install hardhat-deploy-ethers

```
yarn add --dev @nomiclabs/hardhat-ethers hardhat-deploy-ethers ether
```

## Start writing deploy scripts

1. Create a folder <span style="color:green; font-weight:bold"> deploy </span> in project folder.

2. Name the deploy scripts in increasing number so that they gets executed in order. Like 01-deploy-fund-me.js

    ```
    touch 01-deploy-fund-me.js
    ```

## Dealing with different chains

We can't hard code the priceFeed address of a particula network like Sepolia in our contract code (here in FundMe.sol and PriceConverter.sol).

### What happens when we want to change chains?

We make contructor parameterized and pass address of priceFeed instead of hardcoding the address, so that address of different networks can be passed at runtime. Refer files FundMe.sol and PriceConverter.sol.

### How to get priceFeed value while working with localhost or hardhat networks?

When working with localhost or hardhat network we want to use mock. localhost and hardhat network doesn't have priceFeed value. Therefore define a mock solidity file MockV3Aggregator.sol in contracts/test/ folder to define mock priceFeed value for thses local networks so that we can test verything locally.

Github location of MockV3Aggregator.sol:

_[https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/tests/MockV3Aggregator.sol](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/tests/MockV3Aggregator.sol)_

### Content of helper.hardhat.config.js @ this point:

```
const networkConfig = {
    11155111: {
        name: "Sepolia Testnet",
        ethUSDPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
    43114: {
        name: "Avalanche Testnet",
        ethUSDPriceFeed: "0x86d67c3D38D2bCeE722E601025C25a575021c6EA",
    },
    1: {
        name: "Ethereum Mainnet",
        ethUSDPriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    },
}

const developmentChains = ["hardhat", "localhost"]

/*
constructor(uint8 _decimals, int256 _initialAnswer) {
    decimals = _decimals;
    updateAnswer(_initialAnswer);
  }

  Defining constructor parameters of MockV3Aggregator.sol to be used for our
  local MockV3Aggregator.sol file.
*/
const DECIMALS = 8
const INITIAL_ANSWER = 200000000000 //2000 + 8 0's = 2000,00000000

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
}
```

### Content of 00-deploy-mocks.js file @ this point:

```
const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper.hardhat.config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    // const chainId = network.config.chainId

    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("Mocks deployed!")
        log("------------------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
```

### Content of MockV3Aggregator.sol @ this point:

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/tests/MockV3Aggregator.sol";
//https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/tests/MockV3Aggregator.sol

```

### Running depoly for local networks (hardhat & localhost) should deploy successfully.

```
yarn hardhat deploy --tags mocks
```

```
yarn run v1.22.22
warning package.json: No license field
$ /Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-fund-me-fcc/node_modules/.bin/hardhat deploy --tags mocks
Nothing to compile
Local network detected! Deploying mocks...
deploying "MockV3Aggregator" (tx: 0x61af512d9700630840bb9ef58ae73424d196e49aa4ca0341b929775fdaeea4b2)...: deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3 with 694955 gas
Mocks deployed!
------------------------------------------------------------
✨  Done in 3.64s.
```

### Running depoly for test networks (sepolia) should deploy successfully.

```
yarn hardhat deploy --network sepolia --tags fundme
```

```
yarn run v1.22.22
$ /Users/reyansh/Code/Smart/dAppLearned/freecodecamp/hardhat-fund-me-fcc/node_modules/.bin/hardhat deploy --network sepolia --tags fundme
Nothing to compile
deploying "FundMe" (tx: 0x030b85c770ec9b902505994308161f1116d672e791209f92ea8352b102e204c7)...: deployed at 0x0432A306571e4a93C3d65a435afb7f1AC9c480e2 with 811211 gas
Verifying Contract...
Successfully submitted source code for contract
contracts/FundMe.sol:FundMe at 0x0432A306571e4a93C3d65a435afb7f1AC9c480e2
for verification on the block explorer. Waiting for verification result...

Successfully verified contract FundMe on the block explorer.
https://sepolia.etherscan.io/address/0x0432A306571e4a93C3d65a435afb7f1AC9c480e2#code

-------------------------------------------------------------
✨  Done in 84.19s.
```

If you get insufficient error or need more funds to deploy then get it from url:

```
https://cloud.google.com/application/web3/faucet/ethereum/sepolia
```

### Contents of hardhat.config.js after deploy changes

```
require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("@nomicfoundation/hardhat-verify")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")

const SEPOLIA_RPC_URL =
    process.env.SEPOLIA_RPC_URL ||
    "https://eth-sepolia.g.alchemy.com/v2/your-api-key"
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const COINMARKET_API_KEY = process.env.COINMARKET_API_KEY || ""

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
            blockConfirmations: 6,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            chainId: 1337,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.24",
            },
            {
                version: "0.8.0",
            },
        ],
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: false,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "INR",
        coinmarketcap: COINMARKET_API_KEY,
        // token: "MATIC",
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
    },
}
```

### Contents of helper.hardhat.config.js after deploy changes

```
const networkConfig = {
    11155111: {
        name: "Sepolia Testnet",
        ethUSDPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
    43114: {
        name: "Avalanche Testnet",
        ethUSDPriceFeed: "0x86d67c3D38D2bCeE722E601025C25a575021c6EA",
    },
    1: {
        name: "Ethereum Mainnet",
        ethUSDPriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    },
    31337: {
        name: "localhost",
    },
}

const developmentChains = ["hardhat", "localhost"]

/*
constructor(uint8 _decimals, int256 _initialAnswer) {
    decimals = _decimals;
    updateAnswer(_initialAnswer);
  }

  Defining constructor parameters of MockV3Aggregator.sol to be used for our
  local MockV3Aggregator.sol file.
*/
const DECIMALS = 8
const INITIAL_ANSWER = 200000000000 //2000 + 8 0's = 2000,00000000

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
}
```

### Contents of 00-deploy-mocks.js after deploy changes

```
const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper.hardhat.config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // if (chainId == 31337) {
    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("Mocks deployed!")
        log("------------------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
```

### 01-deploy-fund-me.js changes after deploy changes

```
// function deployFunc(hre) {
//     console.log("I am deployed...")
// }
// module.exports.default = deployFunc

const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper.hardhat.config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // if chainId is A use address B
    // if chainId is C use address D
    // const ethUSDPriceFeedAddress = networkConfig[chainId]["ethUSDPriceFeed"]

    let ethUSDPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUSDAggregator = await deployments.get("MockV3Aggregator")
        ethUSDPriceFeedAddress = ethUSDAggregator.address
    } else {
        ethUSDPriceFeedAddress = networkConfig[chainId]["ethUSDPriceFeed"]
    }

    // Question: What happens when we want to change chains
    // Answer: We make contructor parameterized and pass address of priceFeed
    // instead of hardcoding the address, so that address of different networks
    // can be passed at runtime.

    // When working with localhost or hardhat network we want to use mock.
    // Created 00-deploy-mocks.js
    // localhost and hardhat network doesn't have priceFeed value. Therefore
    // define a mock solidity file MockV3Aggregator.sol in contracts/test/ folder
    // to define mock priceFeed value for thses local networks so that we can test
    // everything locally.
    let args = [ethUSDPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }

    log("-------------------------------------------------------------")
}

module.exports.tags = ["all", "fundme"]
```

# Code formatting

<span style="color:orange; font-weight:bold">Solidity Style Guide</span>

_[https://docs.soliditylang.org/en/latest/style-guide.html](https://docs.soliditylang.org/en/latest/style-guide.html)_

<span style="color:orange; font-weight:bold">Order of Functions</span>

Ordering helps readers identify which functions they can call and to find the constructor and fallback definitions easier.

Functions should be grouped according to their visibility and ordered:

1. constructor
2. receive function (if exists)
3. fallback function (if exists)
4. external
5. public
6. internal
7. private

Within a grouping, place the view and pure functions last.

<span style="color:orange; font-weight:bold">NatSpec Format</span>

_[https://docs.soliditylang.org/en/latest/natspec-format.html](https://docs.soliditylang.org/en/latest/natspec-format.html)_

<span style="color:orange; font-weight:bold">Command to generate documentation</sapn>

```
solc --userdoc --devdoi FundMe.sol
```

# Testing

Unit test and Staging test

## Unit Test

Create folders <span style="color:green; font-weight:bold">unit</span> and <span style="color:green; font-weight:bold">staging</span> insice test folder.

Create file <span style="color:green; font-weight:bold">FundMe.test.js</span> inside unit folder.

Contents of test file <span style="color:green; font-weight:bold">FundMe.test.js:</span>

```
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")

// To test all the function of FundMe otherthan contructor
describe("FundMe", async () => {
    let fundMe
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.parseEther("1") // 1 eth

    beforeEach(async () => {
        // deploy FundMe contract using hardhat deploy

        // One way to get accounts
        // const accounts = await ethers.getSigners()
        // const firstAccount = accounts[0]

        // Another way to get account
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        // const fundMeDeployment = await deployments.get("FundMe")
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )

        // // Log MockV2Aggregator object as JSON
        // console.log(
        //     "MockV3Aggregator Object:",
        //     JSON.stringify(mockV3Aggregator, null, 2)
        // )
    })

    // To test the contructor only
    describe("constructor", async () => {
        it("Constructor: Sets the aggregator address correctly", async () => {
            const response = await fundMe.priceFeed()
            console.log(`Constructor: response address ${response}`)
            console.log(
                `Constructor: mockV3Aggregator address ${mockV3Aggregator.target}`
            )
            assert.equal(response, mockV3Aggregator.target)
        })
    })

    describe("fund", async () => {
        it("Fund transfer: Fails if you don't send enough ETH", async () => {
            await expect(fundMe.fund()).to.be.revertedWith(
                "Didn't send enough ETH!"
            )
        })

        it("Fund transfer: Updated the amount funded data structure", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.addressToAmountFunded(deployer)
            console.log(`Fund transfer: SendValue amount: ${sendValue}`)
            console.log(`Fund transfer: Funded amount: ${response}`)
            expect(response.toString()).to.equal(sendValue.toString())
        })

        it("Fund transfer: Adds funder to an array of funders", async () => {
            await fundMe.fund({ value: sendValue })
            const funder = await fundMe.funders(0)
            console.log(
                `Fund transfer: funder with address: ${funder} added to funders array`
            )
            console.log(`Fund transfer: deployer with address: ${deployer}`)
            expect(funder.toString()).to.equal(deployer.toString())
        })
    })

    describe("withdraw", async () => {
        beforeEach(async () => {
            await fundMe.fund({ value: sendValue })
        })

        it("Single withdraw: withdraw ETH from a single funder", async () => {
            // Arrange
            const startingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            )
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )

            console.log(
                `Single withdraw: startingFundMeBalance: ${startingFundMeBalance}`
            )
            console.log(
                `Single withdraw: startingDeployerBalance: ${startingDeployerBalance}`
            )

            // Act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)

            // Gas calculation
            const { gasUsed, gasPrice } = transactionReceipt
            console.log(
                `Single withdraw: gasUsed: ${gasUsed}, gasPrice: ${gasPrice}`
            )
            const gasCost = gasUsed * gasPrice
            console.log(`Single withdraw: Gas Cost ${gasCost}`)

            const endingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            )
            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )

            // Assert & Expect
            const totalStartingBalance = (
                startingFundMeBalance + startingDeployerBalance
            ).toString()
            const totalEndingBalance = (
                endingDeployerBalance + gasCost
            ).toString()
            console.log(
                `Single withdraw: Total starting fund balance ${totalStartingBalance}`
            )
            console.log(
                `Single withdraw: Total ending fund balance ${totalEndingBalance}`
            )

            assert.equal(endingFundMeBalance, 0)
            // assert.equal(startingBalance, endingBalance)
            expect(totalStartingBalance).to.equal(totalEndingBalance)
        })

        it("Multiple withdraw: Allows us to withdraw with multiple funders", async () => {
            // Arrange
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 6; ++i) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                )
                await fundMeConnectedContract.fund({ value: sendValue })
            }

            const startingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            )
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )

            console.log(
                `Multiple withdraw: startingFundMeBalance: ${startingFundMeBalance}`
            )
            console.log(
                `Multiple withdraw: startingDeployerBalance: ${startingDeployerBalance}`
            )

            // Act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)

            // Gas calculation
            const { gasUsed, gasPrice } = transactionReceipt
            console.log(
                `Multiple withdraw: gasUsed: ${gasUsed}, gasPrice: ${gasPrice}`
            )
            const gasCost = gasUsed * gasPrice
            console.log(`Multiple withdraw: Gas Cost ${gasCost}`)

            const endingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            )
            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )

            // Assert & Expect
            const totalStartingBalance = (
                startingFundMeBalance + startingDeployerBalance
            ).toString()
            const totalEndingBalance = (
                endingDeployerBalance + gasCost
            ).toString()
            console.log(
                `Multiple withdraw: Total starting fund balance ${totalStartingBalance}`
            )
            console.log(
                `Multiple withdraw: Total ending fund balance ${totalEndingBalance}`
            )

            expect(endingFundMeBalance).to.equal(0)
            expect(totalStartingBalance).to.equal(totalEndingBalance)

            // Make sure that funders are reset properly
            await expect(fundMe.funders(0)).to.be.reverted

            for (let i = 1; i < 6; ++i) {
                let fundAmount = await fundMe.addressToAmountFunded(accounts[i])
                expect(fundAmount).to.be.equal(0)
                console.log(
                    `Multiple withdraw: fund amount in account[${i}] is ${fundAmount}`
                )
            }
        })

        it("Only owner withdraw: Allows only owner to withdraw fund", async () => {
            const accounts = await ethers.getSigners()
            const otherAccount = accounts[1]
            const notOwnerConnectedContract = await fundMe.connect(otherAccount)
            expect(notOwnerConnectedContract.withdraw()).to.be.revertedWith(
                "FundMe__NotOwner"
            )
            console.log(
                `Only owner withdraw: Contract owner address: ${fundMe.target}`
            )
            console.log(
                `Only owner withdraw: Other account address: ${otherAccount.address}`
            )
            expect(fundMe.target).to.not.equal(otherAccount.address)
        })
    })
})
```

## Gas Optimization

Refer _[Layout of storage variables in Storage](https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html)_ to understand more about storage.

Naming convension for naming state variables:

1. append s\_ for storage variables
2. append i\_ for immutable variables
3. all capital letters for constants

For example:

```
uint256 public constant MINIMUM_USD = 50 * 1e18;
address public immutable i_owner;
address[] public s_funders;
mapping(address => uint256) public s_addressToAmountFunded;
AggregatorV3Interface public s_priceFeed;
```

## Staging Test
