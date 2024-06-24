const { ethers, run, network } = require("hardhat")
require("dotenv").config()

async function main() {
    try {
        const SimpleStorageFactory = await ethers.getContractFactory(
            "SimpleStorage"
        )
        console.log("Deploying contract...")
        const simpleStorage = await SimpleStorageFactory.deploy()

        // console.log(network.config)

        // Deploy to hardhat network (sepolia)
        if (
            network.config.chainId === 11155111 &&
            process.env.ETHERSCAN_API_KEY
        ) {
            console.log("Waiting for block transactions ...")
            await simpleStorage.deploymentTransaction().wait(6)
            await verify(simpleStorage.target, [])
        }

        // Interact with SimpleStorage contract
        const currentValue = await simpleStorage.retrieve()
        console.log(`Current value is ${currentValue}`)
        

        // Update current value
        const transactionResponse = await simpleStorage.store(423)
        await transactionResponse.wait(1)
        const updatedValue = await simpleStorage.retrieve()
        console.log(`Updated value is ${updatedValue}`)
    } catch (error) {
        console.error("Error deploying contract:", error)
    }
}

// async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified")
        } else {
            console.log(e)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
