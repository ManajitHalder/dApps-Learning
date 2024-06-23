const { ethers, run, network } = require("hardhat")
require("dotenv").config()

async function main() {
    try {
        const SimpleStorageFactory = await ethers.getContractFactory(
            "SimpleStorage"
        )
        console.log("Deploying contract...")
        const simpleStorage = await SimpleStorageFactory.deploy()
        // simpleStorage.deployed

        // console.log(`Deployed contract to address: ${simpleStorage.address}`)
    } catch (error) {
        console.error("Error deploying contract:", error)
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
