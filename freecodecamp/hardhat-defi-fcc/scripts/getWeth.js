const { getNamedAccounts, ethers } = require("hardhat")
const { networkConfig } = require("../helper.hardhat.config")

const AMOUNT = ethers.utils.parseEther("0.02")

async function getWeth() {
    const { deployer } = await getNamedAccounts()

    // Ensure deployer is connected as a signer
    // const signer = await ethers.getSigner(deployer)

    // To call "deposit" function on the Weth contract we need the
    // Contract Address of Mainnet: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
    // Mainnet url: https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
    // ABI

    // Get the contract instance with the signer
    const iWeth = await ethers.getContractAt(
        "IWeth",
        networkConfig[network.config.chainId].wethTokenAddress,
        deployer
    )
    const tx = await iWeth.deposit({ value: AMOUNT })
    await tx.wait(1)
    const wethBalance = await iWeth.balanceOf(deployer)
    // console.log(`Got ${wethBalance.toString()} WETH`)
    console.log(`getWeth: Got ${ethers.utils.formatEther(wethBalance)} WETH`)
}

module.exports = {
    getWeth,
    AMOUNT,
}
