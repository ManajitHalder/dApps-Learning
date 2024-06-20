const { ethers } = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8",
    )

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying, please wait...")

    try {
        const nonce = await provider.getTransactionCount(wallet.address)
        const gasPrice = await provider.gasPrice
        // console.log(
        //     "Current gas price:",
        //     ethers.utils.formatUnits(gasPrice, "gwei"),
        //     "gwei",
        // )

        const contract = await contractFactory.deploy({ nonce })

        const deploymentReceipt = contract.deploymentTransaction(1)
        // console.log("Transaction receipt:", deploymentReceipt)
        // console.log("Contract deployed at address: ", contract.address)

        // // const code = await provider.getCode(contract.address)
        // if (code == "0x") {
        //     throw new Error(
        //         "Contract deployment failed, contract code is empty",
        //     )
        // }
        // Get Number
        const currentFavoriteNumber = await contract.retrieve()
        // try {
        //     const currentFavoriteNumber = await contract.retrieve()
        //     console.log(
        //         `Current Favorite Number: ${currentFavoriteNumber.toString()}`,
        //     )
        // } catch (error) {
        //     console.error("Error calling retrieve function:", error)
        // }
        console.log(
            `Current Favorite number: ${currentFavoriteNumber.toString()}`,
        )

        // Store a number
        const transactionResponse = await contract.store("45675")
        const transactionReceipt = await transactionResponse.wait(1)
        const updatedFavoriteNumber = await contract.retrieve()
        console.log(`Updated Favorite Number: ${updatedFavoriteNumber}`)
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
