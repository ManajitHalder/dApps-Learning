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
      })
