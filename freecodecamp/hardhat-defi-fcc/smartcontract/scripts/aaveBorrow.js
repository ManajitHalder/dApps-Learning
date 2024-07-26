const { getWeth } = require("./getWeth")

async function main() {
    // The Aave protocol treats everything as ERC20 token
    await getWeth()
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
