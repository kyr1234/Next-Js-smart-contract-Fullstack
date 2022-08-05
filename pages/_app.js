import { MoralisProvider } from 'react-moralis'

import { NotificationProvider } from 'web3uikit'
import Head from 'next/head'

const APP_ID = process.env.NEXT_PUBLIC_APP_ID
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

function MyApp({ Component, pageProps }) {
  return (
    <div className="">
      <Head>
        <title>NFT-MARKETPLACE</title>
        <meta name="description" content="NFT MARKETPLACE" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoralisProvider
        initializeOnMount={true}
        appId={APP_ID}
        serverUrl={SERVER_URL}
      >
        <NotificationProvider>
          <Component {...pageProps} />
        </NotificationProvider>
      </MoralisProvider>
    </div>
  )
}

export default MyApp
