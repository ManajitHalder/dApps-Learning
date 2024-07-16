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
      Starting balance: 2
      Add consumer: 0xE280d1549A13cf71B7275D789680f9b7F2B6E525
      
2. Deploy our contract using the SubId
      SubscriptionId: 114970156027935344572119887480406656453851062636047038595460985042980786042947

3. Register the contract with Chainlink VRF & it's subId
      Contract address: 0xE280d1549A13cf71B7275D789680f9b7F2B6E525
      SubscriptionId: 114970156027935344572119887480406656453851062636047038595460985042980786042947

4. Register the contract with Chainlink Keepers
      Trigger: Custom logic
      Contract address: 0xE280d1549A13cf71B7275D789680f9b7F2B6E525
      Admin address: 0x3b4c12339a246edfe8c6cfe084a7807bad0e51d4 (walltet address)
      Gas limit: 500000
      Starting balance: 8

5. Run staging tests

*/
