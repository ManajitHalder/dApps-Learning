const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

describe("SimpleStorage", function () {
    let simpleStorageFactory, simpleStorage
    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
    })

    it("Should start with a favorite number of 0", async function () {
        const currentNumber = await simpleStorage.retrieve()
        const expectedNumber = "0"
        assert.equal(currentNumber.toString(), expectedNumber)
        expect(currentNumber.toString()).to.equal(expectedNumber)
        console.log(`Retrieved number is ${currentNumber}`)
    })

    it("Should update favorite number when store is called", async function () {
        const expectedNumber = "434"
        const transactionResponse = await simpleStorage.store(expectedNumber)
        await transactionResponse.wait(1)

        const currentNumber = await simpleStorage.retrieve()
        assert.equal(expectedNumber, currentNumber.toString())
        console.log(`Stored number is ${expectedNumber}`)
    })

    it("Should add first person and should get the persons favorite number", async function () {
        const firstPersonName = "Reyansh Halder"
        const firstPersonFavoriteNumber = "100"
        const transactionResponse = await simpleStorage.addPerson(
            firstPersonName,
            firstPersonFavoriteNumber
        )
        await transactionResponse.wait(1)

        const retrievedFavoriteNumber =
            await simpleStorage.getFavoriteNumberByName(firstPersonName)
        expect(firstPersonFavoriteNumber).to.equal(
            retrievedFavoriteNumber.toString()
        )
        console.log(
            `${firstPersonName}'s favorite number is ${retrievedFavoriteNumber}`
        )
    })

    it("Should add second person and should get the persons favorite number", async function () {
        const secondPersonName = "Agastya Halder"
        const secondPersonFavoriteNumber = "200"
        const transactionResponse = await simpleStorage.addPerson(
            secondPersonName,
            secondPersonFavoriteNumber
        )
        await transactionResponse.wait(1)

        const retrievedFavoriteNumber =
            await simpleStorage.getFavoriteNumberByName(secondPersonName)
        expect(secondPersonFavoriteNumber).to.equal(
            retrievedFavoriteNumber.toString()
        )
        console.log(
            `${secondPersonName}'s favirote number is ${retrievedFavoriteNumber}`
        )
    })

    it("Should add first person and should get the persons favorite number", async function () {
        const firstPersonName = "Reyansh Halder"
        const firstPersonFavoriteNumber = "100"
        const transactionResponse = await simpleStorage.addPerson(
            firstPersonName,
            firstPersonFavoriteNumber
        )
        await transactionResponse.wait(1)

        const retrievedFavoriteNumber =
            await simpleStorage.getFavoriteNumberByName(firstPersonName)
        expect(firstPersonFavoriteNumber).to.equal(
            retrievedFavoriteNumber.toString()
        )
        console.log(
            `${firstPersonName}'s favorite number is ${retrievedFavoriteNumber}`
        )
    })

    it("Should add second person and should get the persons favorite number", async function () {
        const secondPersonName = "Agastya Halder"
        const secondPersonFavoriteNumber = "200"
        const transactionResponse = await simpleStorage.addPerson(
            secondPersonName,
            secondPersonFavoriteNumber
        )
        await transactionResponse.wait(1)

        const retrievedFavoriteNumber =
            await simpleStorage.getFavoriteNumberByName(secondPersonName)
        expect(secondPersonFavoriteNumber).to.equal(
            retrievedFavoriteNumber.toString()
        )
        console.log(
            `${secondPersonName}'s favirote number is ${retrievedFavoriteNumber}`
        )
    })
})

/*
describe("SimpleStorage contract", function () {
    it("Deployment of SimpleStorage contract", async function () {
        const simpleStorage = await ethers.deployContract("SimpleStorage")
        console.log(`Deployed contract to address: ${simpleStorage.address}`)

        // Retrieve a number
        const retrievedNumber = await simpleStorage.retrieve()
        expect(await simpleStorage.retrieve()).to.equal(retrievedNumber)
        console.log(`Retrieved number is ${retrievedNumber}`)

        // Store a nubmer and retrieve it
        await simpleStorage.store(193)
        const retrieveStoredNumber = await simpleStorage.retrieve()
        expect(await simpleStorage.retrieve()).to.equal(retrieveStoredNumber)
        console.log(`Retrieved Stored Number is ${retrieveStoredNumber}`)

        // Add a person and get a persons favorite number
        const firstPerson = "Reyansh Halder"
        await simpleStorage.addPerson(firstPerson, 100)
        const firstPersonsFavoriteNumber = await simpleStorage.getFavoriteNumberByName(firstPerson)
        expect(await simpleStorage.getFavoriteNumberByName(firstPerson)).to.equal(firstPersonsFavoriteNumber)
        console.log(`${firstPerson}'s Favorite Number is ${firstPersonsFavoriteNumber}`)

        // Add a person and get a persons favorite number
        const secondPerson = "Agastya Halder"
        await simpleStorage.addPerson(secondPerson, 200)
        const secondPersonsFavoriteNumber = await simpleStorage.getFavoriteNumberByName(secondPerson)
        expect(await simpleStorage.getFavoriteNumberByName(secondPerson)).to.equal(secondPersonsFavoriteNumber)
        console.log(`${secondPerson}'s Favorite Number is ${secondPersonsFavoriteNumber}`)

        // Store a nubmer and retrieve it
        await simpleStorage.store(82376578)
        const retrieveStoredNumber2 = await simpleStorage.retrieve()
        expect(await simpleStorage.retrieve()).to.equal(retrieveStoredNumber2)
        console.log(`Retrieved Stored Number is ${retrieveStoredNumber2}`)
    })
})
*/
