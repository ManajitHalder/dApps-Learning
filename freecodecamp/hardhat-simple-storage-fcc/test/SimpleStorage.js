const { ethers } = require("hardhat")
const { expect } = require("chai")

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
