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

*[https://www.npmjs.com/package/hardhat-deploy](https://www.npmjs.com/package/hardhat-deploy)*

## Details on hardhat-deploy-ethers repo: 

*[https://github.com/wighawag/hardhat-deploy-ethers#readme](https://github.com/wighawag/hardhat-deploy-ethers#readme)*

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
3. 