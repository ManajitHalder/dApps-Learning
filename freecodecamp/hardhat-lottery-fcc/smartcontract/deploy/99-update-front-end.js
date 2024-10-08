const { ethers } = require("hardhat")
const fs = require("fs")

const FRONT_END_ADDRESSES_FILE = "../frontend/constants/contractAddresses.json"
const FRONT_END_ABI_FILE = "../frontend/constants/abi.json"

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating Front End...")
        await updateContractAddresses()
        await updateAbi()
    }
}

async function updateContractAddresses() {
    const raffle = await ethers.getContract("Raffle")
    const chainId = network.config.chainId.toString()
    let currentAddresses = {}

    if (fs.existsSync(FRONT_END_ADDRESSES_FILE)) {
        currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8"))
    }

    if (chainId in currentAddresses) {
        if (!currentAddresses[chainId].includes(raffle.address)) {
            currentAddresses[chainId].push(raffle.address)
        }
    } else {
        currentAddresses[chainId] = [raffle.address]
    }

    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses, null, 2))
}

async function updateAbi() {
    const raffle = await ethers.getContract("Raffle")
    fs.writeFileSync(
        FRONT_END_ABI_FILE,
        JSON.stringify(JSON.parse(raffle.interface.format(ethers.utils.FormatTypes.json)), null, 2),
    )
}

module.exports.tags = ["all", "frontend"]
