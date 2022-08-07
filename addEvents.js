const Moralis = require('moralis/node')
require('dotenv').config()
const contractAddresses = require('./constants/contract.json')
let chainId = process.env.chainId || 31337
let moralischainid = chainId == '31337' ? '1337' : chainId
const contractAddressArray = contractAddresses[chainId]['NftMarketplace']
const contractAddress = contractAddressArray[contractAddressArray.length - 1]

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
const appId = process.env.NEXT_PUBLIC_APP_ID
const masterKey = process.env.masterKey

async function main() {
  await Moralis.start({ serverUrl, appId, masterKey })
  console.log(`Working with contrat address ${contractAddress}`)

  const itemListed = {
    chainId: moralischainid,
    sync_historical: true,
    topic: 'Item_Listed(address,uint256,uint256,,address)',
    address: contractAddress,
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'nftaddress',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'tokenid',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'price',
          type: 'uint256',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
      ],
      name: 'Item_Listed',
      type: 'event',
    },
    limit: 500000,
    tableName: 'ITEMLISTED',
  }

  const Items_Bought = {
    chainId: moralischainid,
    sync_historical: true,
    topic: 'Item_Bought_OwnerShip_Transfer(address,address,uint256,uint256)',
    address: contractAddress,
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'nftaddress',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'seller',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'tokenid',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'price',
          type: 'uint256',
        },
      ],
      name: 'Item_Bought_OwnerShip_Transfer',
      type: 'event',
    },
    limit: 500000,
    tableName: 'ITEMSBOUGHT',
  }

  const Cancel_Listed = {
    chainId: moralischainid,
    sync_historical: true,
    topic: 'Cancel_Listed(address,uint256,address)',
    address: contractAddress,
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'nftaddress',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'tokenid',
          type: 'uint256',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'seller',
          type: 'address',
        },
      ],
      name: 'Cancel_Listed',
      type: 'event',
    },
    tableName: 'ITEMSCANCEL',
    limit: 500000,
  }

  const listedResponse = await Moralis.Cloud.run(
    'watchContractEvent',
    itemListed,
    {
      useMasterKey: true,
    },
  )
  const boughtResponse = await Moralis.Cloud.run(
    'watchContractEvent',
    Items_Bought,
    {
      useMasterKey: true,
    },
  )
  const canceledResponse = await Moralis.Cloud.run(
    'watchContractEvent',
    Cancel_Listed,
    {
      useMasterKey: true,
    },
  )
  console.log(listedResponse)
  console.log(canceledResponse.success)
  console.log(boughtResponse.success)
  if (
    listedResponse.success &&
    canceledResponse.success &&
    boughtResponse.success
  ) {
    console.log('Success! Database Updated with watching events')
  } else {
    console.log('Something went wrong...')
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
