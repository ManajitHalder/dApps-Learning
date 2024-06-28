const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")

// To test all the function of FundMe otherthan contructor
describe("FundMe", async () => {
    let fundMe
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.parseEther("1") // 1 eth

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
        it("Sets the aggregator address correctly", async () => {
            const response = await fundMe.priceFeed()
            console.log(
                `response address ${response} \nmockV3Aggregator address ${mockV3Aggregator.target}`
            )
            assert.equal(response, mockV3Aggregator.target)
        })
    })

    describe("fund", async () => {
        it("Fails if you don't send enough ETH", async () => {
            await expect(fundMe.fund()).to.be.revertedWith(
                "Didn't send enough ETH!"
            )
        })

        it("Updated the amount funded data structure", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.addressToAmountFunded(deployer)
            console.log(
                `SendValue amount: ${sendValue} \nFunded amount: ${response}`
            )
            expect(response.toString()).to.equal(sendValue.toString())
        })

        it("Adds funder to an array of funders", async () => {
            await fundMe.fund({ value: sendValue })
            const funder = await fundMe.funders(0)
            console.log(
                `funder with address: ${funder} added to funders array \ndeployer with address: ${deployer}`
            )
            expect(funder.toString()).to.equal(deployer.toString())
        })
    })

    describe("withdraw", async () => {
        
    })
})
