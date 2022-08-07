const Moralis = require('moralis/node')
require('dotenv').config()
const contractaddresses = require('./constants/contract.json')
const chainId = process.env.chainId || 31337
const contractaddress = contractaddresses[chainId]['NftMarketplace']
const serverurl = process.env.NEXT_PUBLIC_SERVER_URL
const appid = process.env.NEXT_PUBLIC_APP_ID
const masterkey = process.env.masterkey
const moralischainid = chainId == '31337' ? '1337' : chainId
const main = async () => {
  await Moralis.start({ serverurl, appid, masterkey })

  const itemListed = {
    chainId: moralischainid,
    sync_historical: true,
    topic: 'Item_Listed(address,uint256,uint256,,address)',
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
    tableName: 'ITEM_LISTED_MARKETPLACE',
  }

  const Items_Bought = {
    chainId: moralischainid,
    sync_historical: true,
    topic: 'Item_Bought_OwnerShip_Transfer(address,address,uint256,uint256)',
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
    tableName: 'ITEMS_BOUGHT',
  }

  const Cancel_Listed = {
    chainId: moralischainid,
    sync_historical: true,
    topic: 'Cancel_Listed(address,uint256,address)',
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
    tableName: 'ITEMS_CANCEL',
  }

  const itemlisted = await Moralis.Cloud.run('watchContractEvent', itemListed, {
    useMasterKey: true,
  })
  const itemsbought = await Moralis.Cloud.run(
    'watchContractEvent',
    Items_Bought,
    {
      useMasterKey: true,
    },
  )
  const cancellist = await Moralis.Cloud.run(
    'watchContractEvent',
    Cancel_Listed,
    {
      useMasterKey: true,
    },
  )

  if (itemsbought.success && itemListed.success && cancellist.success) {
    console.log('THE TABLE WITH EVENT IS BEEN ADDED TO MORALIS')
  } else {
    console.log('SOMETHING WENT WRONG')
  }
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((e) => {
    console.log(e)
    process.exit(1)
  })
