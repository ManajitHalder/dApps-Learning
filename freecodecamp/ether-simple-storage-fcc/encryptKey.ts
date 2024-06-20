import { ethers } from "ethers"
import * as fs from "fs-extra"
import "dotenv/config"

async function main() {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!)

    // Dummy progress callback function
    const progressCallback = (percent) => {
        console.log(`Encryption progress: ${percent * 100}%`)
    }

    const encryptedJsonKey = await wallet.encrypt(
        process.env.PRIVATE_KEY_PASSWORD!,
        progressCallback,
    )
    console.log(`encrypted Json Key: ${encryptedJsonKey}`)

    fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
