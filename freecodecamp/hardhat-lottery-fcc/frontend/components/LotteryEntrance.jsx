import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect } from "react"
import { useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
  const chainId = parseInt(chainIdHex)
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null
  const [entranceFee, setEntranceFee] = useState("0")
  const [numberOfPlayers, setNumberOfPlayers] = useState("0")
  const [recentWinner, setRecentWinner] = useState("0")

  const dispatch = useNotification()

  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: [],
    msgValue: entranceFee,
  })

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: [],
  })

  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  })

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: [],
  })

  async function updateUI() {
    try {
      if (!raffleAddress) {
        console.error("Raffle address is not defined.")
        return
      }
      const entranceFeeFromContract = await getEntranceFee()
      const numberOfPlayersFromContract = await getNumberOfPlayers()
      const recentWinnerFromContract = await getRecentWinner()

      if (entranceFeeFromContract) {
        setEntranceFee(entranceFeeFromContract)
        console.log("entranceFee", entranceFee)
      } else {
        console.error("Failed to get entrance fee from contract.")
      }

      if (numberOfPlayersFromContract) {
        console.log(
          "numberOfPlayersFromContract in UpdateUI",
          numberOfPlayersFromContract.toString(),
        )
        setNumberOfPlayers(numberOfPlayersFromContract.toString())
      } else {
        console.error("Failed to get number of players from contract")
      }

      if (recentWinnerFromContract) {
        setRecentWinner(recentWinnerFromContract.toString())
      } else {
        console.log("Failed to get recent winner from contract")
      }
    } catch (error) {
      console.error("Error in updateUI:", error)
    }
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI()
    }
  }, [isWeb3Enabled])

  const handleSuccess = async (tx) => {
    try {
      await tx.wait(1)
      updateUI()
      handleNotification(tx)
    } catch (error) {
      console.log(error)
    }
  }

  // web3ui.github.io/web3uikit/?path=/docs/5-popup-notification--hook-demo
  const handleNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Complete",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell",
    })
  }

  return (
    <div className="p-5">
      Hi from Lottery Entrance !!!
      {raffleAddress ? (
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={async () => {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              })
            }}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter Raffle</div>
            )}
          </button>
          <div>
            Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
          </div>
          <div>Number of Players: {numberOfPlayers} players</div>
          <div>Recent Winner: {recentWinner}</div>
        </div>
      ) : (
        <div> No Raffle Address Detected </div>
      )}
    </div>
  )
}
