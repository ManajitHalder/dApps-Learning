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

          describe("fulfillRandomWords", () => {
              it("fulfillRandomWords: mints NFT after random number is returned", async () => {
                  await new Promise(async (resolve, reject) => {
                      randomIpfsNft.once(
                          "NftMinted",
                          async (tokenId, breed, minter) => {
                              try {
                                  const tokenURI = await randomIpfsNft.tokenURI(
                                      tokenId.toString()
                                  )
                                  const tokenCounter =
                                      await randomIpfsNft.getTokenCounter()
                                  const dogURI =
                                      await randomIpfsNft.getDogTokenURIs(
                                          breed.toString()
                                      )
                                  expect(tokenURI.toString()).to.includes(
                                      "ipfs://"
                                  )
                                  expect(dogURI.toString()).to.be.equal(
                                      tokenURI.toString()
                                  )
                                  expect(+tokenCounter.toString()).to.be.equal(
                                      +tokenId.toString() + 1
                                  )
                                  expect(minter).to.be.equal(deployer.address)
                                  resolve()
                              } catch (error) {
                                  console.log(error)
                                  reject(error)
                              }
                          }
                      )
                      try {
                          const mintFee = await randomIpfsNft.getMintFee()
                          const requestNftResponse =
                              await randomIpfsNft.requestNft({
                                  value: mintFee.toString(),
                              })
                          const requestNftReceipt = requestNftResponse.wait(1)
                          await vrfCoordinatorV2Mock.fulfillRandomWords(
                              requestNftReceipt.events[1].args.requestId,
                              randomIpfsNft.address
                          )
                      } catch (error) {
                          console.log(error)
                          reject(error)
                      }
                  })
              })
          })

          describe("getBreedFromModdedRng", () => {
              it("requestRandomWords: checks chanceArray length and values", async () => {
                  const chanceArray = await randomIpfsNft.getChanceArray()
                  expect(chanceArray.length).to.be.equal(3)
                  expect(chanceArray.toString()).to.be.equal(
                      ["10", "30", "100"].toString()
                  )
              })

              it("requestRandomWords: should return Breed as PUG if moddedRng 0 to 9", async () => {
                  const breed = await randomIpfsNft.getBreedFromModdedRng(9)
                  expect(breed).to.be.equal(0)
              })

              it("requestRandomWords: should return Breed as SHIBA_INU if moddedRng 9 to 29", async () => {
                  const breed = await randomIpfsNft.getBreedFromModdedRng(19)
                  expect(breed).to.be.equal(1)
              })

              it("requestRandomWords: should return Breed as ST_BERNARD if moddedRng 30 to 99", async () => {
                  const breed = await randomIpfsNft.getBreedFromModdedRng(99)
                  expect(breed).to.be.equal(2)
              })

              it("requestRandomWords: should revert if moddedRng > 99", async () => {
                  await expect(
                      randomIpfsNft.getBreedFromModdedRng(100)
                  ).to.be.revertedWith("RandomIpfsNft__RangeOutOfBounds")
              })
          })
      })
