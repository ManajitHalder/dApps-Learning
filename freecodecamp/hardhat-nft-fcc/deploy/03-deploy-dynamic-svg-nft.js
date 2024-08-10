const { network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper.hardhat.config")
const { verify } = require("../utils/verify")
const fs = require("fs")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const chainId = network.config.chainId
    let ethUsdPriceFeedAddress

    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await ethers.getContract("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed
    }

    const lowSvg = fs.readFileSync("./images/dynamicNft/frown.svg", {
        encoding: "utf8",
    })
    const highSvg = fs.readFileSync("./images/dynamicNft/happy.svg", {
        encoding: "utf8",
    })

    log(
        "--------------------------------------------------------------------------"
    )

    const args = [ethUsdPriceFeedAddress, lowSvg, highSvg]

    const dynamicSgvNft = await deploy("DynamicSvgNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // Verify the deployment
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying DynamicSvgNft ...")
        await verify(dynamicSgvNft.address, args)
    }

    log(
        "--------------------------------------------------------------------------"
    )
}

module.exports.tags = ["all", "dynamicsvg", "main"]
