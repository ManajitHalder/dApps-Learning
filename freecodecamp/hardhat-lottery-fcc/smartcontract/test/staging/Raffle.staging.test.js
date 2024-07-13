const { network, getNamedAccounts, ethers, deployments } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper.hardhat.config")
const { assert, expect } = require("chai")

// Run only if we are testnet or mainnet
developmentChains.includes(network.name)
    ? describe.skip // Skip if we are on development chain.
    : describe("Raffle Staging Tests", async () => {
          let raffle, deployer, raffleEntranceFee

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              const raffleDeployment = await deployments.get("Raffle")
              raffle = await ethers.getContractAt("Raffle", raffleDeployment.address, deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
          })

          describe("fulfillRandomWords", () => {
              it("fulfillRandomWords: works with live Chainlink Keepers and Chainlink VRF, we get a random winner", async () => {
                  // enter the raffle
                  const startingTimeStamp = await raffle.getLastTimestamp()
                  const accounts = await ethers.getSigners()

                  await new Promise(async (resolve, reject) => {
                      // setup the listener before we enter the raffle
                      // just in case the blockchain moves really fast
                      raffle.once("WinnerPicked", async () => {
                          console.log("WinnerPicked event fired")
                          resolve()

                          try {
                              const recentWinner = await raffle.getRecentWinner()
                              const raffleState = await raffle.getRaffleState()
                              const winnerEndingBalance = await accounts[0].getBalance()
                              const endingTimeStamp = await raffle.getLastTimestamp()

                              await expect(raffle.getPlayer(0)).to.be.reverted
                              expect(recentWinner.toString()).to.equal(accounts[0].address)
                              expect(raffleState).to.equal(0)
                              expect(winnerEndingBalance.toString()).to.equal(
                                  winnerStartingBalance.add(raffleEntranceFee).toString(),
                              )
                              expect(endingTimeStamp).to.be.greaterThan(startingTimeStamp)

                              resolve()
                          } catch (error) {
                              console.log(error)
                              reject(error)
                          }
                      })
                      // entering the raffle
                      await raffle.enterRaffle({ value: raffleEntranceFee })
                      const winnerStartingBalance = await accounts[0].getbalance()

                      // this code won't complete until our listener has finished listening
                  })
              })
          })
      })

/*
Steps for staging test:

1. Get our SubId for Chainlink VRF
      Create subscription: https://vrf.chain.link/
      
2. Deploy our contract using the SubId
3. Register the contract with Chainlink VRF & it's subId
4. Register the contract with Chainlink Keepers
5. Run staging tests

*/
