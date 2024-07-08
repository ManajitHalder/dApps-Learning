const { ethers, network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper.hardhat.config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = getNamedAccounts()
    const chainId = network.config.chainId
    let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock
    const VRF_SUBSCRIPTION_FUND_AMOUNT = ethers.parseEther("1")

    if (chainId == 31337) {
        // For hardhat or localhost
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.target
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait()
        // subscriptionId = transactionReceipt.events[0].args.subId

        // console.log("Parsing the event log:")
        // Find the SubscriptionCreated event
        const parsedLogs = transactionReceipt.logs.map((log) =>
            vrfCoordinatorV2Mock.interface.parseLog(log),
        )

        const subscriptionCreatedEvent = parsedLogs.find(
            (log) => log.name === "SubscriptionCreated",
        )

        if (subscriptionCreatedEvent) {
            // console.log("subscriptionCreatedEvent: ", subscriptionCreatedEvent)
            // Accessing the subId correctly based on the event structure
            const subID = subscriptionCreatedEvent.args.subId
            // console.log("Subscription ID:", subID) // Ensure to convert to string if necessary

            // Optionally, convert to number if needed
            // subscriptionId = parseInt(subID.toString())
            subscriptionId = subID
            // console.log("Subscription ID (as number):", subscriptionId)
        } else {
            console.error("SubscriptionCreated event not found or parsed incorrectly.")
        }

        // console.log("Subscription ID before findSubscription:", subscriptionId)
        // Fund the subscription
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUBSCRIPTION_FUND_AMOUNT)
        // console.log("fundSubscription called")
    } else {
        // For real testnet
        console.log("Testing testnet Sepolia")
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    const entranceFee = networkConfig[chainId]["entranceFee"]
    const gasLane = networkConfig[chainId]["gasLane"]
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]
    const interval = networkConfig[chainId]["interval"]

    const args = [
        vrfCoordinatorV2Address,
        entranceFee,
        gasLane,
        subscriptionId,
        callbackGasLimit,
        interval,
    ]

    // console.log("Before calling deploy Raffle", args)
    // const Raffle = await ethers.getContractFactory("Raffle")
    // const raffle = await Raffle.deploy(
    //     vrfCoordinatorV2Address,
    //     entranceFee,
    //     gasLane,
    //     subscriptionId,
    //     callbackGasLimit,
    //     interval,
    // )
    const raffle = await deploy("Raffle", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    // console.log("After calling deploy Raffle")

    // Verify on real network
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying on real net ...")
        await verify(raffle.address, args)
    }

    log("----------------------------------------------------------")
}

module.exports.tags = ["all", "raffle"]
