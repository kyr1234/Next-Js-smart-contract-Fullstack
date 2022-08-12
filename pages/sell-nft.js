import contract from '../constants/contract.json'
import nftAbi from '../constants/BasicNft.json'
import { useMoralis, useWeb3Contract } from 'react-moralis'
import { Form, useNotification } from 'web3uikit'
import { ethers } from 'ethers'
import nftMarketplaceAbi from '../constants/NftMarketplace.json'
export default function Home() {
  const dispatch = useNotification()
  const { chainId } = useMoralis()
  //converted to readable form
  const chainString = chainId ? parseInt(chainId) : '1337'
  console.log(contract[chainString].NftMarketplace[0])
  const marketplaceaddress = contract[chainString].NftMarketplace[0]

  const { runContractFunction } = useWeb3Contract()

  const ListingNft = async (nftaddress, tokenid, price) => {
    console.log('LISTING THE NFT')
    const listoptions = {
      abi: nftMarketplaceAbi,
      contractAddress: marketplaceaddress,
      functionName: 'Listitem',
      params: {
        nftaddress: nftaddress,
        tokenid: tokenid,
        price: price,
      },
    }
    const handleListSuccess =  () => {
      dispatch({
        type: 'success',
        title: 'NFT LISTED',
        message: 'THE NFT IS LISTED',
        position: 'topR',
      })
    }
    await runContractFunction({
      params: listoptions,
      onSuccess: () => {
        handleListSuccess()
      },
      onError: (error) => {
        console.log(error)
      },
    })
  }

  const ApproveAndList = async (data) => {
    //these is in form of 0x145 form
    console.log('Approving...')
    const nftAddress = data.data[0].inputResult
    const tokenId = data.data[1].inputResult
    const price = ethers.utils
      .parseUnits(data.data[2].inputResult, 'ether')
      .toString()

    const approveOptions = {
      abi: nftAbi,
      contractAddress: nftAddress,
      functionName: 'approve',
      params: {
        to: marketplaceaddress,
        tokenId: tokenId,
      },
    }

    await runContractFunction({
      params: approveOptions,
      onError: (error) => console.log(error),
      onSuccess: () => ListingNft(nftAddress, tokenId, price),
    })
  }

  return (
    <div>
      <Form
        onSubmit={ApproveAndList}
        data={[
          {
            name: 'NFT ADDRESS',
            type: 'text',
            value: '',
            inputWidth: '50%',
            key: 'nftAddress',
          },
          {
            name: 'TokenId',
            type: 'number',
            value: '',
            key: 'tokenId',
          },
          {
            name: 'Price (ETH)',
            type: 'number',
            value: '',
            key: 'price',
          },
        ]}
        title="SELL THE NFT"
        id="Main Form"
      />
    </div>
  )
}
