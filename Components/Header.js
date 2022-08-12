import { ConnectButton } from 'web3uikit'
import Link from 'next/link'
export default function Header() {
  return (
    <nav className="header border-2 flex justify-between items-center">
      <div className="flex justify-around items-center">
        <h1 className="py-4 px-4 font-bold text-xl"> NFT-MARKETPLACES</h1>
      </div>
      <Link href="/">HOME</Link>
      <Link href="/sell-nft">SELL NFT</Link>
      <div className="">
        <ConnectButton moralisAuth={false} />
      </div>
    </nav>
  )
}
