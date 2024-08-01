const { network, ethers } = require("hardhat")
const { developmentChains } = require("../../helper.hardhat.config")
const { assert } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Random IPFS NFT Unit Tests", function () {
          let randomIpfsNft, deployer, vrfCoordinatorV2Mock

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["mocks", "randomipfs"])
              randomIpfsNft = await ethers.getContract("RandomIpfsNft")
              vrfCoordinatorV2Mock = await ethers.getContract(
                  "VRFCoordinatorV2Mock"
              )
          })

          describe("constructor", () => {
              it("constructor: sets starting values correctly", async () => {
                    const tokenCounter = await randomIpfsNft.getTokenCounter()
                    const dogTokenURIAtFirstIndex =
                        await randomIpfsNft.getDogTokenURIs(0)
                    const mintFee = await randomIpfsNft.getMintFee()
                    expect(tokenCounter).to.be.equal(0)
              })
          })

          //   describe("requestNft", () => {
          //       it("requestNft", async () => {})
          //   })

          //   describe("requestRandomWords", () => {
          //       it("requestRandomWords", async () => {})
          //   })

          //   describe("fulfillRandomWords", () => {
          //       it("fulfillRandomWords", async () => {})
          //   })
      })
