const { ethers, network } = require("hardhat")
const { developmentChains } = require("../helper.hardhat.config")

const BASE_FEE = ethers.parseEther("0.25")
const GAS_PRICE_LINK = 1e9 // 1000000000

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // If we are on local development network, we need to deploy mocks
    if (developmentChains.includes(network.name)) {
        // if (chainId == 31337) {
        log("Local network detected! Deploying mocks...")
        // deploy a mock vrfcoordinator
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE_LINK],
        })
        log("Mocks Deployed...")
        log("-----------------------------------------------------")
    }
}

module.exports.tag = ["all", "mocks"]
