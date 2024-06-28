const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")

// To test all the function of FundMe otherthan contructor
describe("FundMe", async () => {
    let fundMe
    let deployer
    let mockV3Aggregator

    beforeEach(async () => {
        // deploy FundMe contract using hardhat deploy

        // One way to get accounts
        // const accounts = await ethers.getSigners()
        // const firstAccount = accounts[0]

        // Another way to get account
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        // const fundMeDeployment = await deployments.get("FundMe")
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )

        // // Log MockV2Aggregator object as JSON
        // console.log(
        //     "MockV3Aggregator Object:",
        //     JSON.stringify(mockV3Aggregator, null, 2)
        // )
    })

    // To test the contructor only
    describe("constructor", async () => {
        it("sets the aggregator address correctly", async () => {
            const response = await fundMe.priceFeed()
            // console.log(`response ${response}`)
            // console.log(`mockV3Aggregator address ${mockV3Aggregator.target}`)
            assert.equal(response, mockV3Aggregator.target)
        })
    })

    describe("fund", async () => {
        it("Fails if you don't send enough ETH", async () => {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        })
    })
})
