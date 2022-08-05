import { ConnectButton } from 'web3uikit'
export default function Header() {
  return (
    <nav className="header">
      <h1 className="py-4 px-4 font-bold text-3xl"> NFT-MARKETPLACE</h1>
      <div className="ml-auto py-2 px-4">
        <ConnectButton moralisAuth={false} />
      </div>
    </nav>
  )
}
