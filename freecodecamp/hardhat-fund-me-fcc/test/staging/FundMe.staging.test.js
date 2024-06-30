const { getNamedAccounts, network, ethers } = require("hardhat")
const { developmentChains } = require("../../helper.hardhat.config")
const { expect } = require("chai")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe Staging Test", async () => {
          let fundMe
          let deployer
          const sendValue = ethers.parseEther("0.001") // 0.1 ETH
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
          })

          it("Fund and Withdraw: Allows people to fund and withdraw", async () => {
              const fundTxResponse = await fundMe.fund({ value: sendValue })
              await fundTxResponse.wait(1)
              const withdrawTxResponse = await fundMe.withdraw()
              await withdrawTxResponse.wait(1)

              const endingBalance = await fundMe.provider.getBalance(
                  fundMe.target
              )
              console.log(`Ending balance: ${endingBalance}`)
              expect(endingBalance.toString).to.be.equal(0)
          })
      })
