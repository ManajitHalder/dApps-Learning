const { ethers } = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
    // console.log(`Ethers version: ${ethers.version}`);
    // console.log(`RPC URL: ${process.env.RPC_URL}`);
    // console.log(`Private Key: ${process.env.PRIVATE_KEY}`);

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    // const encryptedJson = fs.readFileSync('./.encryptedKey.json', 'utf8');
    // let wallet = ethers.Wallet.fromEncryptedJsonSync(
    //   encryptedJson,
    //   process.env.PRIVATE_KEY_PASSWORD
    // );
    // wallet = wallet.connect(provider);

    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    )

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying, please wait...")

    // Deploy the contract with a manual gas limit
    // const gasLimit = 1000000; // Adjust the gas limit as needed
    // const contract = await contractFactory.deploy({ gasLimit });
    // const contract = await contractFactory.deploy({ gasPrice: 100000000000 });

    try {
        const nonce = await provider.getTransactionCount(wallet.address)

        const contract = await contractFactory.deploy({ nonce })
        // console.log('Contract:', contract);
        // console.log('Contract address:', contract.address);
        // console.log('Contract deployment transaction:', contract.deployTransaction);

        const deploymentReceipt = contract.deploymentTransaction()
        // console.log('Transaction receipt:', deploymentReceipt);

        // Get Number
        const currentFavoriteNumber = await contract.retrieve()
        console.log(
            `Current Favorite number: ${currentFavoriteNumber.toString()}`
        )

        // Store a number
        const transactionResponse = await contract.store("45675")
        const transactionReceipt = await transactionResponse.wait(1)
        const updatedFavoriteNumber = await contract.retrieve()
        console.log(`Updated Favorite Number: ${updatedFavoriteNumber}`)
    } catch (error) {
        console.error("Error deploying contract:", error)
    }
}
// await contract.deployed();

// console.log("Let's deploy with only transaction data!");
// const nonce = await wallet.getTransactionCount();

// const tx = {
//   nonce: nonce,
//   gasPrice: 20000000000,
//   gasLimit: 1000000,
//   to: null,
//   value: 0,
//   data: '0x6080604052348015600e575f80fd5b506107cf8061001c5f395ff3fe608060405234801561000f575f80fd5b506004361061004a575f3560e01c80632e64cec11461004e5780636057361d1461006c5780636f760f41146100885780639e7a13ad146100a4575b5f80fd5b6100566100d5565b604051610063919061027d565b60405180910390f35b610086600480360381019061008191906102c8565b6100dd565b005b6100a2600480360381019061009d9190610354565b6100e6565b005b6100be60048036038101906100b991906102c8565b6101b0565b6040516100cc929190610421565b60405180910390f35b5f8054905090565b805f8190555050565b80600284846040516100f992919061048b565b9081526020016040518091039020819055506001604051806040016040528083815260200185858080601f0160208091040260200160405190810160405280939291908181526020018383808284375f81840152601f19601f82011690508083019250505050505050815250908060018154018082558091505060019003905f5260205f2090600202015f909190919091505f820151815f015560208201518160010190816101a891906106ca565b505050505050565b600181815481106101bf575f80fd5b905f5260205f2090600202015f91509050805f0154908060010180546101e4906104fd565b80601f0160208091040260200160405190810160405280929190818152602001828054610210906104fd565b801561025b5780601f106102325761010080835404028352916020019161025b565b820191905f5260205f20905b81548152906001019060200180831161023e57829003601f168201915b5050505050905082565b5f819050919050565b61027781610265565b82525050565b5f6020820190506102905f83018461026e565b92915050565b5f80fd5b5f80fd5b6102a781610265565b81146102b1575f80fd5b50565b5f813590506102c28161029e565b92915050565b5f602082840312156102dd576102dc610296565b5b5f6102ea848285016102b4565b91505092915050565b5f80fd5b5f80fd5b5f80fd5b5f8083601f840112610314576103136102f3565b5b8235905067ffffffffffffffff811115610331576103306102f7565b5b60208301915083600182028301111561034d5761034c6102fb565b5b9250929050565b5f805f6040848603121561036b5761036a610296565b5b5f84013567ffffffffffffffff8111156103885761038761029a565b5b610394868287016102ff565b935093505060206103a7868287016102b4565b9150509250925092565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f6103f3826103b1565b6103fd81856103bb565b935061040d8185602086016103cb565b610416816103d9565b840191505092915050565b5f6040820190506104345f83018561026e565b818103602083015261044681846103e9565b90509392505050565b5f81905092915050565b828183375f83830152505050565b5f610472838561044f565b935061047f838584610459565b82840190509392505050565b5f610497828486610467565b91508190509392505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061051457607f821691505b602082108103610527576105266104d0565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026105897fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8261054e565b610593868361054e565b95508019841693508086168417925050509392505050565b5f819050919050565b5f6105ce6105c96105c484610265565b6105ab565b610265565b9050919050565b5f819050919050565b6105e7836105b4565b6105fb6105f3826105d5565b84845461055a565b825550505050565b5f90565b61060f610603565b61061a8184846105de565b505050565b5b8181101561063d576106325f82610607565b600181019050610620565b5050565b601f821115610682576106538161052d565b61065c8461053f565b8101602085101561066b578190505b61067f6106778561053f565b83018261061f565b50505b505050565b5f82821c905092915050565b5f6106a25f1984600802610687565b1980831691505092915050565b5f6106ba8383610693565b9150826002028217905092915050565b6106d3826103b1565b67ffffffffffffffff8111156106ec576106eb6104a3565b5b6106f682546104fd565b610701828285610641565b5f60209050601f831160018114610732575f8415610720578287015190505b61072a85826106af565b865550610791565b601f1984166107408661052d565b5f5b8281101561076757848901518255600182019150602085019450602081019050610742565b868310156107845784890151610780601f891682610693565b8355505b6001600288020188555050505b50505050505056fea2646970667358221220df69db88f52c41b7c0b916ea88ebc6e58a001b5bcd9036ea446ec22b89da14c664736f6c634300081a0033',
//   chainId: 1337,
// };

// // const signedTxResponse = await wallet.signTransaction(tx); // for signing transaction, not sending. we need to send to
// const sentTxResponse = await wallet.sendTransaction(tx);
// await sentTxResponse.wait(1);
// console.log(sentTxResponse);
// }

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
