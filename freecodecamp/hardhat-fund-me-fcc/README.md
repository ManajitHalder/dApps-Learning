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
yarn hardhat deploy --tag mocks
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
solc --userdoc --devdoi ex1. sol
```
