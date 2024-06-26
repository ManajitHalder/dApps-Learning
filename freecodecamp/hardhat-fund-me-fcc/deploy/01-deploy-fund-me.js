// function deployFunc(hre) {
//     console.log("I am deployed...")
// }
// module.exports.default = deployFunc

const { network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
}
