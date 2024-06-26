// function deployFunc(hre) {
//     console.log("I am deployed...")
// }
// module.exports.default = deployFunc

const { network } = require("hardhat")
const { networkConfig } = require("../helper.hardhat.config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // if chainId is A use address B
    // if chainId is C use address D
    const ethUSDPriceFeedAddress = networkConfig[chainId]["ethUSDPriceFeed"]

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
}
