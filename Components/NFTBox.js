import { useState, useEffect } from 'react'
import { useWeb3Contract, useMoralis } from 'react-moralis'
import nftAbi from '../constants/BasicNft.json'
import NftMarketplaceAbi from '../constants/NftMarketplace.json'
import Image from 'next/image'
import { Card, useNotification } from 'web3uikit'
import { ethers } from 'ethers'
import UpdateModal from './UpdateModal'
const truncate = (fullstr, strlen) => {
  if (fullstr.length <= strlen) return fullstr

  const seprator = '...'
  const sepratorlength = seprator.length
  const charlength = strlen - sepratorlength
  const frontcharslength = charlength / 2
  const backcharlength = charlength / 2
  return (
    fullstr.substring(0, frontcharslength) +
    seprator +
    fullstr.substring(fullstr.length - backcharlength)
  )
}
export default function NFTBox({
  price,
  nftAddress,
  tokenId,
  marketplaceAddress,
  seller,
}) {
  const { isWeb3Enabled, account } = useMoralis()
  const [imageURI, setImageURI] = useState('')
  const [tokenName, setTokenName] = useState('')
  const [tokenDescription, setTokenDescription] = useState('')
  const [showModal, setModal] = useState(false)
  const dispatch = useNotification()

  const { runContractFunction: tokenURI } = useWeb3Contract({
    abi: nftAbi,
    contractAddress: nftAddress,
    functionName: 'tokenURI',
    params: {
      tokenId: tokenId,
    },
  })

  const { runContractFunction: buyItem } = useWeb3Contract({
    abi: NftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: 'buyItem',
    msgValue: price,
    params: {
      nftAddress,
      tokenId,
    },
  })

  const handleBuying = () => {
    dispatch({
      type: 'success',
      title: 'The Buying is Complete',
      message: 'The Buying is completed',
      position: 'topR',
    })
  }

  const OwnedByuser = seller === account || seller === undefined
  const formattedseller = OwnedByuser ? 'You' : truncate(seller, 15)

  const handleClickOnCard = () => {
    OwnedByuser
      ? setModal(true)
      : buyItem({
          onError: (error) => console.log(error),
          onSuccess: () => handleBuying(),
        })
  }

  const OnClose = () => {
    setModal(false)
  }

  async function updateUI() {
    const tokenURI =
      'ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json'
    console.log(`The TokenURI is ${tokenURI}`)

    // We are going to cheat a little here...
    if (tokenURI) {
      // IPFS Gateway: A server that will return IPFS files from a "normal" URL.
      const requestURL = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/')
      const tokenURIResponse = await (await fetch(requestURL)).json()
      const imageURI = tokenURIResponse.image
      const imageURIURL = imageURI.replace('ipfs://', 'https://ipfs.io/ipfs/')
      setImageURI(imageURIURL)
      setTokenName(tokenURIResponse.name)
      setTokenDescription(tokenURIResponse.description)
      // We could render the Image on our sever, and just call our sever.
      // For testnets & mainnet -> use moralis server hooks
      // Have the world adopt IPFS
      // Build our own IPFS gateway
    }
    // get the tokenURI
    // using the image tag from the tokenURI, get the image
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI()
    }
  }, [isWeb3Enabled])

  return (
    <div>
      <div>
        {imageURI ? (
          <div>
            <UpdateModal
              isVisible={showModal}
              OnClose={OnClose}
              marketplaceAddress={marketplaceAddress}
              tokenId={tokenId}
              nftAddress={nftAddress}
            />
            <Card
              title={tokenName}
              description={tokenDescription}
              onClick={handleClickOnCard}
            >
              <div className="p-2">
                <div className="flex flex-col items-end gap-2">
                  <div>#{tokenId}</div>
                  <div className="italic text-sm">
                    Owned by {formattedseller}
                  </div>
                  <Image
                    loader={() => imageURI}
                    src={imageURI}
                    height="200"
                    width="200"
                  />
                  <div className="font-bold">
                    {ethers.utils.formatUnits(price, 'ether')} ETH
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  )
}
