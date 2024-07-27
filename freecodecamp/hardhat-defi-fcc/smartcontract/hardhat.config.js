/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
// require("hardhat-contract-sizer")
require("dotenv").config()
// require("@nomiclabs/hardhat-ethers")
// require("@nomicfoundation/hardhat-ethers")

// require("@nomicfoundation/hardhat-chai-matchers")
// require("@nomiclabs/hardhat-waffle")

const SEPOLIA_RPC_URL =
    process.env.SEPOLIA_RPC_URL ||
    "https://eth-sepolia.g.alchemy.com/v2/P1KIhRkvzxF_FV_OTzkAHZYMLqdPTKCt"
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const COINMARKET_API_KEY = process.env.COINMARKET_API_KEY || ""

// const HARDHAT_CHAIN_ID = Number(process.env.HARDHAT_CHAIN_ID) || 31337
// const SEPOLIA_CHAIN_ID = Number(process.env.SEPOLIA_CHAIN_ID) || 11155111
// const LOCALHOST_CHAIN_ID = Number(process.env.LOCALHOST_CHAIN_ID) || 1337

const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || ""

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        compilers: [{ version: "0.8.24" }, { version: "0.6.12" }, { version: "0.4.19" }],
    },

    defaultNetwork: "hardhat",

    networks: {
        hardhat: {
            chainId: 31337,
            forking: {
                url: MAINNET_RPC_URL,
            },
        },
        localhost: {
            chainId: 31337,
            blockConfirmations: 1,
        },
        sepolia: {
            chainId: 11155111,
            accounts: [PRIVATE_KEY],
            url: SEPOLIA_RPC_URL,
            blockConfirmations: 6,
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
        customChains: [
            {
                network: "sepolia",
                chainId: 11155111,
                urls: {
                    apiURL: "https://api-sepolia.etherscan.io/api",
                    browserURL: "https://sepolia.etherscan.io",
                },
            },
        ],
    },
    gasReporter: {
        enabled: false,
        currency: "INR",
        outputFile: "gas-report.txt",
        noColors: true,
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        player: {
            default: 1,
        },
    },
    mocha: {
        timeout: 300000, // 300000 milisecond = 300 seconds
    },
}
