const { network, ethers } = require("hardhat")
const { developmentChains } = require("../../helper.hardhat.config")
const { assert, expect } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Random IPFS NFT Unit Tests", function () {
          let randomIpfsNft, deployer, vrfCoordinatorV2Mock

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              const randomIpfsNftDeployment = await deployments.get(
                  "RandomIpfsNft"
              )
              randomIpfsNft = await ethers.getContractAt(
                  "RandomIpfsNft",
                  randomIpfsNftDeployment.address,
                  deployer
              )
              const vrfCoordinatorV2MockDeployment = await deployments.get(
                  "VRFCoordinatorV2Mock"
              )
              vrfCoordinatorV2Mock = await ethers.getContractAt(
                  "VRFCoordinatorV2Mock",
                  vrfCoordinatorV2MockDeployment.address,
                  deployer
              )
          })

          describe("constructor", () => {
              it("constructor: sets starting values correctly", async () => {
                  const tokenCounter = await randomIpfsNft.getTokenCounter()
                  const dogTokenURIAtFirstIndex =
                      await randomIpfsNft.getDogTokenURIs(0)
                  const mintFee = await randomIpfsNft.getMintFee()
                  expect(tokenCounter).to.be.equal(0)
                  expect(dogTokenURIAtFirstIndex).includes("ipfs://")
                  expect(mintFee.gt(0)).to.be.true
              })
          })

          describe("requestNft", () => {
              it("requestNft: fails if payment amount is not sent with the request", async () => {
                  await expect(randomIpfsNft.requestNft()).to.be.revertedWith(
                      "RandomIpfsNft__NeedMoreETHSent"
                  )
              })

              it("requestNft: fails if payment amount is less than mint fee", async () => {
                  const mintFee = await randomIpfsNft.getMintFee()

                  // Sending zero Ether
                  await expect(
                      randomIpfsNft.requestNft({ value: 0 })
                  ).to.be.revertedWith("RandomIpfsNft__NeedMoreETHSent")

                  // Sending less than the required mint fee
                  await expect(
                      randomIpfsNft.requestNft({ value: mintFee.div(2) })
                  ).to.be.revertedWith("RandomIpfsNft__NeedMoreETHSent")

                  // Sending slightly less than the required mint fee
                  await expect(
                      randomIpfsNft.requestNft({
                          value: mintFee.sub(ethers.utils.parseEther("0.001")),
                      })
                  ).to.be.revertedWith("RandomIpfsNft__NeedMoreETHSent")
              })

              it("requestNft: emits an event after getting the requested random word", async () => {
                  const mintFee = await randomIpfsNft.getMintFee()
                  const request = randomIpfsNft.requestNft({
                      value: mintFee.toString(),
                  })
                  expect(request).to.emit(randomIpfsNft, "NftRequested")
              })
          })

          //   describe("requestRandomWords", () => {
          //       it("requestRandomWords", async () => {})
          //   })

          //   describe("fulfillRandomWords", () => {
          //       it("fulfillRandomWords", async () => {})
          //   })

          describe("getChanceArray", () => {
              it("getChanceArray: ")
          })
      })
