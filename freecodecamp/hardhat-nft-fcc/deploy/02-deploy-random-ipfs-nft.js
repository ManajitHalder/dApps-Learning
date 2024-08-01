const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper.hardhat.config")
const { verify } = require("../utils/verify")
const {
    storeImages,
    storeTokenUriMetadata,
} = require("../utils/uploadToPinata")

const FUND_AMOUNT = "1000000000000000000000"

const imagesLocation = "./images/randomNft"
let tokenURIs = [
    "ipfs://QmQs4yASJakykKzcUYiJoQEFptCuufghNA3S5J2CkD47tp",
    "ipfs://QmXry9jwWVKfbt6V87Gzd97WJ5LGAmtyWY7znSQXCRysv9",
    "ipfs://QmX5V7Xc31vMfM8tYgrNefix1WCFmiMqpLzjDtk6PgTQd2",
]

const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            trait_type: "cuteness",
            value: 100,
        },
    ],
}

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // get the IPFS hashes of our images
    // 1. With our own IPFS nodel. https: //docs. ipfs. io/
    // 2. pinata ht bs: //www.pinata.cloud/
    // 3. nft.storage https://nft.storage/

    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenURIs = await handleTokenURIs()
    }

    // Debug logs
    // console.log("Chain ID:", chainId)
    // console.log("Network Config:", networkConfig)
    // console.log("Current Network Config:", networkConfig[chainId])

    let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock

    if (developmentChains.includes(network.name)) {
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const tx = await vrfCoordinatorV2Mock.createSubscription()
        const txReceipt = await tx.wait(1)
        subscriptionId = txReceipt.events[0].args.subId

        // Fund the subscription
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    log("--------------------------------------------------------------------")

    const args = [
        vrfCoordinatorV2Address,
        subscriptionId,
        networkConfig[chainId]["keyHash"],
        networkConfig[chainId]["callbackGasLimit"],
        tokenURIs,
        networkConfig[chainId]["mintFee"],
        vrfCoordinatorV2Address,
    ]

    const randomIpfsNft = await deploy("RandomIpfsNft", {
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
        log("Verifying RandomIpfsNft ...")
        await verify(randomIpfsNft.address, args)
    }

    log("--------------------------------------------------------------------")
}

async function handleTokenURIs() {
    tokenURIs = []
    // 1. store images to IPFS
    // 2. store metadata to IPFS
    const { responses: imageUploadResponses, files } = await storeImages(
        imagesLocation
    )
    for (imageUploadResponseIndex in imageUploadResponses) {
        // create metadata
        // upload the metadata
        let tokenUriMetadata = { ...metadataTemplate }
        tokenUriMetadata.name = files[imageUploadResponseIndex].replace(
            ".png",
            ""
        )
        tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup!`
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
        console.log("Uploading ", tokenUriMetadata.name)

        // Store the JSON to pinata / IPFS
        const metadataUploadResponse = await storeTokenUriMetadata(
            tokenUriMetadata
        )
        tokenURIs.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    }
    console.log("Uploaded Token URIs are!!!")
    console.log(tokenURIs)

    return tokenURIs
}

module.exports.tags = ["all", "randomIpfs", "main"]
