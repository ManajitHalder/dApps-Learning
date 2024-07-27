const { getWeth } = require("./getWeth")
const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    // The Aave protocol treats everything as ERC20 token
    await getWeth()

    const { deployer } = await getNamedAccounts()

    // Depositing into Aave
    // We need the abi and address of Aave protocol
    // Address of LendingPoolAddressesProvider: 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
    // Url for getting LendingPoolAddressesProvider: https://docs.aave.com/developers/v/2.0/deployed-contracts/deployed-contracts

    const lendingPool = await getLendingPool(deployer)
    console.log("Lending pool address", lendingPool.address)
}

async function getLendingPool(account) {
    const lendingPoolAddressesProvider = await ethers.getContractAt(
        "ILendingPoolAddressesProvider",
        "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        account,
    )

    const lendingPoolAddress = await lendingPoolAddressesProvider.getLendingPool()
    const lendingPool = await ethers.getContractAt("ILendingPool", lendingPoolAddress, account)

    return lendingPool
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
