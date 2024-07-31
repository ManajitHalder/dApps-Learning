const { network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper.hardhat.config")
const { verify } = require("../utils/verify")
const { storeImages } = require("../utils/uploadToPinata")

const imagesLocation = "./images/randomNft"

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // get the IPFS hashes of our images

    // 1. With our own IPFS nodel. https: //docs. ipfs. io/
    // 2. pinata ht bs: //www.pinata.cloud/
    // 3. nft.storage https://nft.storage/
    let tokenURIs
    if (process.env.UPLOAD_TO_PINATA) {
        tokenURIs = await handleTokenURIs()
    }

    let vrfCoordinatorV2Address, subscriptionId

    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract(
            "VRFCoordinatorV2Mock"
        )
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const tx = await vrfCoordinatorV2Mock.createSubscription()
        const txReceipt = await tx.wait(1)
        subscriptionId = txReceipt.events[0].args.subscriptionId
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkConfig[chainId].subscriptionId
    }

    log("--------------------------------------------------------------------")

    await storeImages(imagesLocation)

    // const args = [
    //     vrfCoordinatorV2Address,
    //     subscriptionId,
    //     networkConfig[chainId].keyHash,
    //     networkConfig[chainId].callbackGasLimit,
    //     //dogTokenURIs
    //     networkConfig[chainId].mintFee,
    //     //initialOwner
    // ]
    // const randomIpfsNft = await deploy("RandomIpfsNft", {
    //     from: deployer,
    //     args: args,
    //     log: true,
    //     waitConfirmations: network.config.blockConfirmations || 1,
    // })

    // Verify the deployment
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying BasicNft ...")
        await verify(randomIpfsNft.address, args)
    }

    log("--------------------------------------------------------------------")
}

async function handleTokenURIs() {
    tokenURIs = []
    // 1. store images to IPFS
    // 2. store metadata to IPFS

    return tokenURIs
}

module.exports.tags = ["all", "randomIpfs", "main"]
