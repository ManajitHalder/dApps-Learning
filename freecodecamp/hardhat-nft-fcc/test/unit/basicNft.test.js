const { network } = require("hardhat")
const { developmentChains } = require("../../helper.hardhat.config")
const { assert } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Basic NFT Unit Tests", function () {
          let basicNft, deployer

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              const BasicNft = await ethers.getContractFactory("BasicNft")
              basicNft = await BasicNft.deploy()
              await basicNft.deployed()
          })

          describe("Constructor", () => {
              it("Constructor: Initializes the NFT correctly.", async () => {
                  const name = await basicNft.name()
                  const symbol = await basicNft.symbol()
                  const tokenCounter = await basicNft.getTokenCounter()
                  assert.equal(name, "Dogie")
                  assert.equal(symbol, "DOG")
                  assert.equal(tokenCounter, 0)
              })
          })

          describe("Mint NFT", () => {
              beforeEach(async () => {
                  const txResponse = await basicNft.mintNft()
                  await txResponse.wait(1)
              })

              it("Mint NFT: Allows users to mint an NFT, and updates appropriately", async () => {
                  const tokenURI = await basicNft.tokenURI(0)
                  const tokenCounter = await basicNft.getTokenCounter()

                  assert.equal(tokenURI, await basicNft.TOKEN_URI())
                  assert.equal(tokenCounter, 1)
              })

              it("Mint NFT: Show the correct balance and owner of an NFT", async function () {
                  const deployerAddress = deployer.address
                  const deployerBalance = await basicNft.balanceOf(
                      deployerAddress
                  )
                  const owner = await basicNft.ownerOf("0")

                  assert.equal(deployerBalance.toString(), "1")
                  assert.equal(owner, deployerAddress)
              })
          })
      })
