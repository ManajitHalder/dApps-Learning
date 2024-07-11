const { network, getNamedAccounts, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper.hardhat.config")
const { assert, expect } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle Unit Test", async () => {
          let raffle, vrfCoordinatorV2Mock, deployer
          const chainId = network.config.chainId

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              raffle = await ethers.getContract("Raffle", deployer)
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
          })

          describe("constructor", async () => {
              it("constructor: Initializes the raffle correctly", async () => {
                  const raffleState = await raffle.getRaffleState()
                  const interval = await raffle.getInterval()
                  assert.equal(raffleState.toString(), "0")
                  //   assert.equal(interval.toString(), networkConfig[chainId]["interval"])
                  expect(interval.toString()).to.equal(networkConfig[chainId]["interval"])
              })
          })

          describe("enterRaffle", async () => {
              it("enterRaffle: reverts when you don't pay", async () => {
                  await expect(raffle.enterRaffle()).to.be.revertedWith(
                      "Raffle__NotEnoughETHEntered",
                  )
              })
          })
      })
