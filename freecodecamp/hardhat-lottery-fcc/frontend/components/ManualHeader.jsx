import { useMoralis } from "react-moralis"

export default function ManualHeader() {
  const { enableWeb3, account, isWeb3Enabled } = useMoralis()

  return (
    <div>
      {account ? (
        <div>
          Connected to {account.slice(0, 4)}...
          {account.slice(account.length - 4)} ({account})
        </div>
      ) : (
        <button
          onClick={async () => {
            await enableWeb3()
          }}
        >
          Connect
        </button>
      )}
    </div>
  )
}
