const { ethers } = require("ethers");
const fs = require("fs-extra");

async function main() {
  //   console.log("firtime in nodejs");
  //   let variable = 5;
  //   console.log(variable);
  //http://127.0.0.1:7545
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:7545"
  );
  const wallet = new ethers.Wallet(
    "0xb7ab25c0e09aa17cf322627d3865db48aa3f839576610337503c36ae2e642e55",
    provider
  );

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait...");

  // Deploy the contract with a manual gas limit
  const gasLimit = 1000000; // Adjust the gas limit as needed
  const contract = await contractFactory.deploy({gasLimit});
  await contract.deployed();
  
  console.log(contract);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
