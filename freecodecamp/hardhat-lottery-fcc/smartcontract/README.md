# Create a hardhat project

yarn add --dev hardhat

yarn hardhat

-   create an empty hardhat.config.js

Install all dependencies. After installation check for all pacakges installed under section "devDependencies".

yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle chai ethereum-waffle hardhat hardhat-contract-sizer hardhat-deploy hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage dotenv

Add the packages added to hardhat.config.js file:

```
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()
```

Add .prettierrc and its content:

```
{
    "useTabs": false,
    "singleQuote": false,
    "tabWidth": 4,
    "semi": false,
    "printWidth": 100
}
```
