import { useMoralis } from 'react-moralis'
import { useEffect } from 'react'
import { withCoalescedInvoke } from 'next/dist/lib/coalesced-function'
export default function Header() {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis()

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(account)
      if (account == null) {
        window.localStorage.removeItem('connected')
        deactivateWeb3()
        console.log('NULL ACCOUNT FOUND')
      }
    })
  })

  useEffect(() => {
    if (isWeb3Enabled) return
    if (window != 'undefined') {
      if (window.localStorage.getItem('connected')) {
        enableWeb3()
      }
    }
  }, [isWeb3Enabled])

  return (
    <div>
      {account ? (
        <div>
          Connected TO {account.slice(0, 6)}...
          {account.slice(account.length - 4)}
        </div>
      ) : (
        <button
          onClick={async () => {
            enableWeb3()
            if (window != 'undefined') {
              window.localStorage.setItem('connected', 'inject')
            }
          }}
          disabled={isWeb3EnableLoading}
        >
          Connect
        </button>
      )}
    </div>
  )
}
