const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
require("dotenv").config()

const pinataApiKey = process.env.PINATA_API_KEY
const pinataApiSecret = process.env.PINATA_API_SECRET
const pinata = pinataSDK(pinataApiKey, pinataApiSecret)

async function storeImages(imageFilePath) {
    console.log("Uploading to Pinata!!!")

    const fullImagePath = path.resolve(imageFilePath)
    const files = fs.readdirSync(fullImagePath)

    console.log(`\nfullImagePath: ${fullImagePath}`)
    console.log(`\nfiles: ${files}`)

    let responses = []
    for (let fileIndex in files) {
        console.log(`Working on file ${fileIndex}`)
        const readableStreamForFiles = fs.createReadStream(
            `${fullImagePath}/${files[fileIndex]}`
        )
        try {
            const response = await pinata.pinFileToIPFS(readableStreamForFiles)
            responses.push(response)
        } catch (error) {
            console.error(error)
        }
        console.log("\nreadableStreamForFiles: ", readableStreamForFiles.path)
    }

    return { responses, files }
}

async function storeTokenUriMetadata(metadata) {
    try {
        const response = await pinata.pinJSONToIPFS(metadata)
        return response
    } catch (error) {
        console.log(error)
    }

    return null
}

module.exports = { storeImages, storeTokenUriMetadata }
