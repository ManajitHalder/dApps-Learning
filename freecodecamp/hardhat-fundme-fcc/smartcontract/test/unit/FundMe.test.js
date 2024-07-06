const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../../helper.hardhat.config")

// To test all the function of FundMe otherthan contructor
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
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
              it("Constructor: Sets the aggregator address correctly", async () => {
                  const response = await fundMe.getPriceFeed()
                  console.log(`Constructor: response address ${response}`)
                  console.log(
                      `Constructor: mockV3Aggregator address ${mockV3Aggregator.target}`
                  )
                  assert.equal(response, mockV3Aggregator.target)
              })
          })

          describe("fund", async () => {
              it("Fund transfer: Fails if you don't send enough ETH", async () => {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "Didn't send enough ETH!"
                  )
              })

              it("Fund transfer: Updated the amount funded data structure", async () => {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer
                  )
                  console.log(`Fund transfer: SendValue amount: ${sendValue}`)
                  console.log(`Fund transfer: Funded amount: ${response}`)
                  expect(response.toString()).to.equal(sendValue.toString())
              })

              it("Fund transfer: Adds funder to an array of funders", async () => {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.getFunders(0)
                  console.log(
                      `Fund transfer: funder with address: ${funder} added to funders array`
                  )
                  console.log(
                      `Fund transfer: deployer with address: ${deployer}`
                  )
                  expect(funder.toString()).to.equal(deployer.toString())
              })
          })

          describe("withdraw", async () => {
              beforeEach(async () => {
                  await fundMe.fund({ value: sendValue })
              })

              it("Single withdraw: withdraw ETH from a single funder", async () => {
                  // Arrange
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  console.log(
                      `Single withdraw: startingFundMeBalance: ${startingFundMeBalance}`
                  )
                  console.log(
                      `Single withdraw: startingDeployerBalance: ${startingDeployerBalance}`
                  )

                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)

                  // Gas calculation
                  const { gasUsed, gasPrice } = transactionReceipt
                  console.log(
                      `Single withdraw: gasUsed: ${gasUsed}, gasPrice: ${gasPrice}`
                  )
                  const gasCost = gasUsed * gasPrice
                  console.log(`Single withdraw: Gas Cost ${gasCost}`)

                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.target
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  // Assert & Expect
                  const totalStartingBalance = (
                      startingFundMeBalance + startingDeployerBalance
                  ).toString()
                  const totalEndingBalance = (
                      endingDeployerBalance + gasCost
                  ).toString()
                  console.log(
                      `Single withdraw: Total starting fund balance ${totalStartingBalance}`
                  )
                  console.log(
                      `Single withdraw: Total ending fund balance ${totalEndingBalance}`
                  )

                  assert.equal(endingFundMeBalance, 0)
                  // assert.equal(startingBalance, endingBalance)
                  expect(totalStartingBalance).to.equal(totalEndingBalance)
              })

              it("Multiple withdraw: Allows us to withdraw with multiple funders", async () => {
                  // Arrange
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; ++i) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }

                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)
                  const startingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  console.log(
                      `Multiple withdraw: startingFundMeBalance: ${startingFundMeBalance}`
                  )
                  console.log(
                      `Multiple withdraw: startingDeployerBalance: ${startingDeployerBalance}`
                  )

                  // Act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)

                  // Gas calculation
                  const { gasUsed, gasPrice } = transactionReceipt
                  console.log(
                      `Multiple withdraw: gasUsed: ${gasUsed}, gasPrice: ${gasPrice}`
                  )
                  const gasCost = gasUsed * gasPrice
                  console.log(`Multiple withdraw: Gas Cost ${gasCost}`)

                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.target
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer)

                  // Assert & Expect
                  const totalStartingBalance = (
                      startingFundMeBalance + startingDeployerBalance
                  ).toString()
                  const totalEndingBalance = (
                      endingDeployerBalance + gasCost
                  ).toString()
                  console.log(
                      `Multiple withdraw: Total starting fund balance ${totalStartingBalance}`
                  )
                  console.log(
                      `Multiple withdraw: Total ending fund balance ${totalEndingBalance}`
                  )

                  expect(endingFundMeBalance).to.equal(0)
                  expect(totalStartingBalance).to.equal(totalEndingBalance)

                  // Make sure that funders are reset properly
                  await expect(fundMe.getFunders(0)).to.be.reverted

                  for (let i = 1; i < 6; ++i) {
                      let fundAmount = await fundMe.getAddressToAmountFunded(
                          accounts[i]
                      )
                      expect(fundAmount).to.be.equal(0)
                      console.log(
                          `Multiple withdraw: fund amount in account[${i}] is ${fundAmount}`
                      )
                  }
              })

              it("Only owner withdraw: Allows only owner to withdraw fund", async () => {
                  const accounts = await ethers.getSigners()
                  const otherAccount = accounts[1]
                  const notOwnerConnectedContract = await fundMe.connect(
                      otherAccount
                  )
                  expect(
                      notOwnerConnectedContract.withdraw()
                  ).to.be.revertedWith("FundMe__NotOwner")
                  console.log(
                      `Only owner withdraw: Contract owner address: ${fundMe.target}`
                  )
                  console.log(
                      `Only owner withdraw: Other account address: ${otherAccount.address}`
                  )
                  expect(fundMe.target).to.not.equal(otherAccount.address)
              })
          })
      })
