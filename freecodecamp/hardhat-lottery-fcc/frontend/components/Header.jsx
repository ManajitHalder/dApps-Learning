import { ConnectButton } from "web3uikit"

export default function Header() {
  return (
    <div>
      <div>Decentralized Raffle</div>
      <ConnectButton moralisAuth={false} />
    </div>
  )
}
