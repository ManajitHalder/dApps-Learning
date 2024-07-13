const { network, getNamedAccounts, ethers, deployments } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper.hardhat.config")
const { assert, expect } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Test", async () => {
          let raffle, vrfCoordinatorV2Mock, deployer, raffleEntranceFee, interval
          const chainId = network.config.chainId

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              const raffleDeployment = await deployments.get("Raffle")
              raffle = await ethers.getContractAt("Raffle", raffleDeployment.address, deployer)
              const vrfCoordinatorV2MockDeployment = await deployments.get("VRFCoordinatorV2Mock")
              vrfCoordinatorV2Mock = await ethers.getContractAt(
                  "VRFCoordinatorV2Mock",
                  vrfCoordinatorV2MockDeployment.address,
                  deployer,
              )

              /*
              The addConsumer function is used to register a consumer contract with the VRF coordinator. 
              The consumer contract is the one that will request random values and receive the random words 
              from the VRF coordinator.

              Key VRF-Related Functions
              
              1. requestRandomWords: This function is called by the Raffle contract to request random words 
              from the VRF coordinator.
              
              2. fulfillRandomWords: This function is called by the VRF coordinator 
              (or in your mock, by the test code) to deliver the random words to the Raffle contract.

              Raffle Contract Integration
              
              In the Raffle contract, the flow typically looks something like this:
              
              1.Perform Upkeep: The Raffle contract checks if it's time to pick a winner. 
              This is done in the performUpkeep function.
              
              2. Request Random Words: If it's time to pick a winner, the Raffle contract calls 
              requestRandomWords on the VRF coordinator to get random values.
              
              3. Receive Random Words: Once the random words are generated, the VRF coordinator 
              calls fulfillRandomWords on the Raffle contract to provide the random values.
              */
              let subId = await raffle.getSubscriptionId()
              await vrfCoordinatorV2Mock.addConsumer(subId, raffle.address)

              raffleEntranceFee = await raffle.getEntranceFee()
              interval = await raffle.getInterval()
          })

          describe("constructor", async () => {
              it("constructor: Initializes the raffle correctly", async () => {
                  const raffleState = await raffle.getRaffleState()
                  assert.equal(raffleState.toString(), "0")
                  expect(interval.toString()).to.equal(networkConfig[chainId]["interval"])
              })
          })

          describe("enterRaffle", async () => {
              it("enterRaffle: reverts when you don't pay", async () => {
                  await expect(raffle.enterRaffle()).to.be.revertedWith(
                      "Raffle__NotEnoughETHEntered",
                  )
              })

              it("enterRaffle: records player when they enter", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  const playerFromContract = await raffle.getPlayer(0)
                  expect(playerFromContract).to.equal(deployer)
              })

              it("enterRaffle: emits event on enterRaffle", async () => {
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.emit(
                      raffle,
                      "RaffleEnter",
                  )
              })

              it("enterRaffle: doesn't allow enterRaffle when raffle state is CALCULATING", async () => {
                  /*
                  To make this test pass we have to make the raffle state CALCULATING (not OPEN).
                  There is only one way it is getting set to CALCULATION and it is in method performUpkeep
                  function. After checkUpkeep returns true, raffle state is set to CALCULATING.

                  CheckUpkeep can return true if it statifies the following conditions:
                  if raffle state is OPEN
                  if timepassed is greater than interval
                  if raffle has atleat 1 player (which is already true)
                  if raffle has some balance
                  */

                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  const blockBefore = await ethers.provider.getBlock("latest")
                  const timeBefore = blockBefore.timestamp

                  // increase time interval
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])

                  const blockAfter = await ethers.provider.getBlock("latest")
                  const timeAfter = blockAfter.timestamp
                  const timeInterval = await raffle.getInterval()

                  console.log("Time before increasing time interval ", timeInterval.toNumber())
                  console.log("Time after increasing time interval ", timeAfter - timeBefore)

                  // we pretend to be chainlink keeper
                  let state = await raffle.getRaffleState()
                  console.log("Raffle state before performUpkeep: ", state.toString())

                  await raffle.performUpkeep([])

                  state = await raffle.getRaffleState()
                  console.log("Raffle state after performUpkeep: ", state.toString())

                  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.be.revertedWith(
                      "Raffle__NotOpen",
                  )
              })
          })

          describe("checkUpkeep", async () => {
              /*
                bool isOpen = (s_raffleState == RaffleState.OPEN);
                bool timepassed =  ((block.timestamp - s_lastBlockTimestamp) > i_interval);
                bool hasPlayers = (s_players.length > 0);
                bool hasBalance =  = (address(this).balance > 0);
                */
              it("checkupKeep: returns false if account is not funded with ETH", async () => {
                  // Don't fund so that the basBalance is false. isOpen is true, hasPlayers is true.
                  // Set timepassed to true.
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x")
                  expect(upkeepNeeded).to.not.equal(true)
              })

              it("checkUpkeep: returns false if contract state isn't OPEN", async () => {
                  // Set hasBalance, timepassed
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])

                  // Change the state to CALCULATING by calling performUpkeep()
                  await raffle.performUpkeep("0x")
                  const raffleState = await raffle.getRaffleState()
                  expect(raffleState.toString()).to.be.equal("1")

                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x")
                  expect(upkeepNeeded).to.be.false
              })

              it("checkUpkeep: returns false if enough time hasn't passed, time remains same", async () => {
                  // Send some ETH. Remaining. Don't increase the timestamp
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x")
                  expect(upkeepNeeded).to.be.false
              })

              it("checkUpkeep: returns true if all 4 conditions (enough time has passed, state is OPEN, is funded and has player", async () => {
                  // Send some fund
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  // set timepassed
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 2])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  // check raffle state
                  const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x")
                  expect(upkeepNeeded).to.be.true
              })
          })

          describe("performUpkeep", () => {
              it("performUpkeep: it can run only when checkUpkeep returns true", async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  const tx = await raffle.performUpkeep("0x")
                  expect(tx).to.exist
              })

              it("performUpkeep: it reverts if checkUpkeep is false", async () => {
                  // Set the event parameters
                  const raffleBalance = await ethers.provider.getBalance(raffle.address)
                  const playerCount = await raffle.getNumberOfPlayers()
                  const raffleState = await raffle.getRaffleState()

                  await expect(raffle.performUpkeep([])).to.be.revertedWith(
                      "Raffle__UpkeepNotNeeded",
                  )

                  // Try calling performUpkeep and catch the error
                  try {
                      await raffle.performUpkeep([])
                  } catch (error) {
                      // Decode the error data to extract the parameters
                      const errorData = error.data
                      const iface = new ethers.utils.Interface([
                          "error Raffle__UpkeepNotNeeded(uint256 currentBalance, uint256 numPlayers, uint256 raffleState)",
                      ])

                      const decodeError = iface.decodeErrorResult(
                          "Raffle__UpkeepNotNeeded",
                          errorData,
                      )
                      //   Check if the decoded parameters match the actual parameters values
                      expect(decodeError.currentBalance.toString()).to.equal(
                          raffleBalance.toString(),
                      )
                      expect(decodeError.numPlayers.toString()).to.equal(playerCount.toString())
                      expect(decodeError.raffleState.toString()).to.equal(raffleState.toString())
                  }
              })

              it("performUpkeep: it updates the raffle state, emits the event and calls the vrfCoordinator", async () => {
                  // pay some ETH and add some timestamp
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.send("evm_mine", [])
                  const txResponse = await raffle.performUpkeep([])
                  const txReceipt = await txResponse.wait(1)
                  const requestId = txReceipt.events[1].args.requestId
                  console.log("Request Id: ", txReceipt.events[1].args.requestId.toNumber())
                  expect(requestId.toNumber()).to.be.greaterThan(0)
                  const raffleState = await raffle.getRaffleState()
                  expect(raffleState.toString()).to.equal("1")
              })
          })

          describe("fulfillRandomWords", () => {
              beforeEach(async () => {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.request({ method: "evm_mine", params: [] })
              })

              it("fulfillRandomWords: can only be called after performUpkeep", async () => {
                  await expect(
                      vrfCoordinatorV2Mock.fulfillRandomWords(0, raffle.address),
                  ).to.be.revertedWith("nonexistent request")
                  await expect(
                      vrfCoordinatorV2Mock.fulfillRandomWords(1, raffle.address),
                  ).to.be.revertedWith("nonexistent request")
              })

              it("fulfillRandomWords: picks a winner, resets the lottery, and sends money", async () => {
                  const additionalEntrants = 3
                  const startAccountIndex = 1 // deployer is 0
                  const accounts = await ethers.getSigners()

                  for (let i = startAccountIndex; i < startAccountIndex + additionalEntrants; ++i) {
                      const accountConnectedRaffle = raffle.connect(accounts[i])
                      await accountConnectedRaffle.enterRaffle({ value: raffleEntranceFee })
                  }

                  const startingTimeStamp = await raffle.getLastTimestamp()

                  // performUpkeep (mock being Chainlink keepers)
                  // fulfillRandomWords (mock being the Chainlink VRF)
                  // We will have to wait for the fulfillRandomWords to be called
                  await new Promise(async (resolve, reject) => {
                      raffle.once("WinnerPicked", async () => {
                          console.log("Found the event!!!")
                          try {
                              const recentWinner = await raffle.getRecentWinner()
                              const raffleState = await raffle.getRaffleState()
                              const endingTimeStamp = await raffle.getLastTimestamp()
                              const numberOfPlayer = await raffle.getNumberOfPlayers()

                              console.log("recentWinner: ", recentWinner)
                              console.log("accounts[0]: ", accounts[0].address)
                              console.log("accounts[1]: ", accounts[1].address)
                              console.log("accounts[2]: ", accounts[2].address)
                              console.log("accounts[3]: ", accounts[3].address)

                              const winnerEndingBalance = await accounts[1].getBalance()

                              // expect(recentWinner)
                              expect(raffleState.toString()).to.equal("0")
                              expect(endingTimeStamp.toNumber()).to.be.greaterThan(
                                  startingTimeStamp.toNumber(),
                              )
                              expect(numberOfPlayer.toString()).to.equal("0")
                              // winnerStartingBalance + ( (raffleEntranceFee * additionalEntrants) + raffleEntranceFee )
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  winnerStartingBalance.add(
                                      raffleEntranceFee
                                          .mul(additionalEntrants)
                                          .add(raffleEntranceFee)
                                          .toString(),
                                  ),
                              )
                          } catch (error) {
                              reject(error)
                          }

                          resolve()
                      })
                      // Setting up the listener
                      // below we will fire event. The listener will pick it up, and resolve
                      const tx = await raffle.performUpkeep([])
                      const txReceipt = await tx.wait(1)
                      const winnerStartingBalance = await accounts[1].getBalance()
                      await vrfCoordinatorV2Mock.fulfillRandomWords(
                          txReceipt.events[1].args.requestId,
                          raffle.address,
                      )
                  })
              })
          })
      })
