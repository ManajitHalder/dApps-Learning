const { network, ethers } = require("hardhat")
const { developmentChains } = require("../../helper.hardhat.config")
const { assert, expect } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Dynamic SVG Unit Tests", function () {
          let dynamicSvgNft, deployer, mockV3Aggregator

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              const dynamicSgvNftDeployment = await deployments.get(
                  "DynamicSvgNft"
              )
              dynamicSvgNft = await ethers.getContractAt(
                  "DynamicSvgNft",
                  dynamicSgvNftDeployment.address,
                  deployer
              )
              const mockV3AggregatorDeployment = await deployments.get(
                  "MockV3Aggregator"
              )
              mockV3Aggregator = await ethers.getContractAt(
                  "MockV3Aggregator",
                  mockV3AggregatorDeployment.address,
                  deployer
              )
          })

          describe("constructor", () => {
              it("constructor: sets starting values correctly", async () => {})
          })

          describe("requestNft", () => {})

          describe("fulfillRandomWords", () => {})

          describe("getBreedFromModdedRng", () => {})
      })
