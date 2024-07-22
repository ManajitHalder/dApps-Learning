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

  const { runContractFunction: enterRaffle } = useWeb3Contract({
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
    params: [],
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
        // console.log("entranceFee", entranceFee)
      } else {
        console.error("Failed to get entrance fee from contract.")
      }

      if (numberOfPlayersFromContract) {
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

  const handleSuccess = async function (tx) {
    await tx.wait(1)
    handleNotification(tx)
    updateUI()
  }

  // web3ui.github.io/web3uikit/?path=/docs/5-popup-notification--hook-demo
  const handleNotification = function () {
    dispatch({
      type: "info",
      message: "Transaction Complete",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell",
    })
  }

  return (
    <div>
      Hi from Lottery Entrance !!!
      {raffleAddress ? (
        <div>
          <button
            onClick={async function () {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              })
            }}
          >
            Enter Raffle
          </button>
          <div>
            Entrance Fee: {ethers.utils.formatEther(entranceFee, "ether")} ETH
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
