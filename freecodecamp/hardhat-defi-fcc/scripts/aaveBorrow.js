const { developmentChains, networkConfig } = require("../helper.hardhat.config")
const { getWeth, AMOUNT } = require("./getWeth")
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
    console.log("aaveBorrow: Lending pool address", lendingPool.address)

    // Deposit
    const wethTokenAddress = networkConfig[network.config.chainId].wethTokenAddress

    // Approve
    await approveERC20(wethTokenAddress, lendingPool.address, AMOUNT, deployer)
    console.log("Depositing...")
    await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0)
    console.log("Deposited!")

    // Borrow
    let { totalDebtETH, availableBorrowsETH } = await getBorrowUserData(lendingPool, deployer)

    const daiPrice = await getDAIPrice()
    const amountOfDAIToBorrow = availableBorrowsETH.toString() * 0.95 * (1 / daiPrice.toNumber())
    console.log(`You can borrow ${amountOfDAIToBorrow} DAI`)
    const amountOfDaiToBorrowInWei = ethers.utils.parseEther(amountOfDAIToBorrow.toString())
    console.log(`You can borrow ${amountOfDaiToBorrowInWei} DAI in WEI`)

    // availableBorrowsETH ?? What the conversion rate on DAI is?
    // How much we have borrowed, how much we have in collateral, how much we can borrow.
    const daiTokenAddress = networkConfig[network.config.chainId].daiTokenAddress

    await borrowDAI(daiTokenAddress, lendingPool, amountOfDaiToBorrowInWei, deployer)
    await getBorrowUserData(lendingPool, deployer)

    // Repay
    await repay(amountOfDaiToBorrowInWei, daiTokenAddress, lendingPool, deployer)
    await getBorrowUserData(lendingPool, deployer)
}

async function repay(amount, daiAddress, lendingPool, account) {
    await approveERC20(daiAddress, lendingPool.address, amount, account)
    const repayTx = await lendingPool.repay(daiAddress, amount, 2, account)
    await repayTx.wait(1)
    console.log("\nRepayed!!!")
}
async function borrowDAI(daiAddress, lendingPool, amountOfDaiToBorrowInWei, account) {
    const borrowTx = await lendingPool.borrow(daiAddress, amountOfDaiToBorrowInWei, 2, 0, account)
    await borrowTx.wait(1)
    console.log("You have borrowed!!!")
}

async function getDAIPrice() {
    // DAI / ETH Adress on Ethereum Mainnet (https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum&page=5)
    const daiETHPriceFeed = await ethers.getContractAt(
        "AggregatorV3Interface",
        networkConfig[network.config.chainId].daiEthPriceFeed
    )
    // Since we are not sending any transaction we are not passing the deployer to connect
    // to the deployer. We are just going to read from the transaction.
    // Reading don't need a signer (deployer)
    // Sending need a signer (deployer)

    const price = (await daiETHPriceFeed.latestRoundData())[1]
    console.log(`The DAI/ETH price is ${price.toString()}`)

    return price
}

async function getBorrowUserData(lendingPool, account) {
    const {
        totalCollateralETH,
        totalDebtETH,
        availableBorrowsETH,
        currentLiquidationThreshold,
        healthFactor,
    } = await lendingPool.getUserAccountData(account)

    console.log(`\nYou have ${totalCollateralETH} worth of ETH deposited in your Account`)
    console.log(`You have ${totalDebtETH} worth of ETH borrowed`)
    console.log(`You can borrow ${availableBorrowsETH} worth of ETH`)
    console.log(`Your current liquidation threshold is ${currentLiquidationThreshold}`)
    console.log(`Your account health factor is ${healthFactor}\n`)

    return { totalDebtETH, availableBorrowsETH }
}

async function approveERC20(erc20Address, spenderAddress, amountToSpend, account) {
    const erc20Token = await ethers.getContractAt("IERC20", erc20Address, account)
    const tx = await erc20Token.approve(spenderAddress, amountToSpend)
    await tx.wait(1)
    console.log("Approved!")
}

async function getLendingPool(account) {
    const lendingPoolAddressesProvider = await ethers.getContractAt(
        "ILendingPoolAddressesProvider",
        networkConfig[network.config.chainId].lendingPoolAddressesProvider,
        account
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
