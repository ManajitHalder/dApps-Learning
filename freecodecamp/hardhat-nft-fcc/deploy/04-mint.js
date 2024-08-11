const { network, ethers, getNamedAccounts } = require("hardhat")

module.exports = async ({ getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // Basic NFT
    const basicNFT = await ethers.getContract("BasicNft", deployer)
    const basicMintTx = await basicNFT.mintNft()
    await basicMintTx.wait(1)
    console.log(
        "\n--------------------------------------------------------------------------"
    )
    console.log(`Basic NFT index 0 tokenURI: ${await basicNFT.tokenURI(0)}`)

    // Dynamic SVG NFT
    const highValue = ethers.utils.parseEther("4000")
    const dynamicSvgNft = await ethers.getContract("DynamicSvgNft", deployer)
    const dynamicSvgNftMintTx = await dynamicSvgNft.mintNft(highValue)
    await dynamicSvgNftMintTx.wait(1)
    console.log(
        "\n--------------------------------------------------------------------------"
    )
    console.log(
        `Dynamic SVG NFT index 0 tokenURI: ${await dynamicSvgNft.tokenURI(0)}`
    )

    // Random IPFS NFT
    const randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer)
    const mintFee = await randomIpfsNft.getMintFee()
    const randomIpfsNftMintTx = await randomIpfsNft.requestNft({value: mintFee.toString()})
    const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1)

    // Need to listen for response
    await new Promise(async (resolve, reject) => {
        setTimeout(() => reject("Timeout: 'NFTMinted' event did not fire"), 300000) // 5 minutes timeout time
        
        // setup listener for our event
        randomIpfsNft.once("NftMinted", async () => {
            console.log(
                "\n--------------------------------------------------------------------------"
            )
            console.log(`Random IPFS NFT index 0 tokenURI: ${await randomIpfsNft.tokenURI(0)}`)
            resolve()
        })

        if (chainId == 1337) {
            const requestId = randomIpfsNftMintTxReceipt.events[1].args.requestId.toString()
            const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
            await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomIpfsNft.address)
        }
    })
}

module.exports.tags = ["all", "mint"]
