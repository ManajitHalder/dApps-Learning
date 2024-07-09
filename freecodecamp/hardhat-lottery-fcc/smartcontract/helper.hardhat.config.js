// Defines network configuration settings for and is exporting those settings for use in
// 00-deply-mocks.js

// const { config } = require("dotenv").config()
const { ethers } = require("hardhat")

const SEPOLIA_CHAIN_ID = Number(process.env.SEPOLIA_CHAIN_ID) || 11155111
const LOCALHOST_CHAIN_ID = Number(process.env.LOCALHOST_CHAIN_ID) || 1337

const networkConfig = {
    // [SEPOLIA_CHAIN_ID]: {
    11155111: {
        name: "Sepolia",
        vrfCoordinatorV2: "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B",
        entranceFee: ethers.parseEther("0.01"),
        gasLane: "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
        subscriptionId: "0",
        callbackGasLimit: "500000",
        interval: "30",
    },
    // [LOCALHOST_CHAIN_ID]: {
    31337: {
        name: "localhost",
        entranceFee: ethers.parseEther("25"),
        gasLane: "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
        callbackGasLimit: "500000",
        interval: "30",
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}
