const { ethers, network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper.hardhat.config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock
    const VRF_SUBSCRIPTION_FUND_AMOUNT = ethers.utils.parseEther("30")

    // if (chainId == 31337) {
    if (developmentChains.includes(network.name)) {
        // For hardhat or localhost

        const vrfCoordinatorV2MockDeployment = await deployments.get("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Mock = await ethers.getContractAt(
            "VRFCoordinatorV2Mock",
            vrfCoordinatorV2MockDeployment.address,
            deployer,
        )
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait(1)
        subscriptionId = transactionReceipt.events[0].args.subId
        // console.log(transactionReceipt.events[0].args.subId.toNumber())

        // Fund the subscription
        await vrfCoordinatorV2Mock.fundSubscription(
            subscriptionId.toNumber(),
            VRF_SUBSCRIPTION_FUND_AMOUNT,
        )
        // console.log("fundSubscription called")
    } else {
        // For real testnet
        console.log("Testing testnet Sepolia")
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = ethers.BigNumber.from(networkConfig[chainId]["subscriptionId"]).toString() // Convert to string
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

    const raffle = await deploy("Raffle", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // Verify on real network
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying on real net ...")
        await verify(raffle.address, args)
    }

    log("----------------------------------------------------------")
}

module.exports.tags = ["all", "raffle"]
