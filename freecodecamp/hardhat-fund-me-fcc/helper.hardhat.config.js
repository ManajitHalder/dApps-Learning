const networkConfig = {
    11155111: {
        name: "Sepolia Testnet",
        ethUSDPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
    43114: {
        name: "Avalanche Testnet",
        ethUSDPriceFeed: "0x86d67c3D38D2bCeE722E601025C25a575021c6EA",
    },
    1: {
        name: "Ethereum Mainnet",
        ethUSDPriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    },
    31337: {
        name: "localhost",
    },
}

const developmentChains = ["hardhat", "localhost"]

/*
constructor(uint8 _decimals, int256 _initialAnswer) {
    decimals = _decimals;
    updateAnswer(_initialAnswer);
  }

  Defining constructor parameters of MockV3Aggregator.sol to be used for our
  local MockV3Aggregator.sol file.
*/
const DECIMALS = 8
const INITIAL_ANSWER = 200000000000 //2000 + 8 0's = 2000,00000000

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
}
