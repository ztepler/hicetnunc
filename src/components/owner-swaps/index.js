import React, { useContext } from 'react'
import { Button, Primary, Purchase } from '../button'
import { walletPreview } from '../../utils/string'
import styles from './styles.module.scss'
import { HicetnuncContext } from '../../context/HicetnuncContext'

const sortByPrice = (a, b) => {
  return Number(a.xtz_per_objkt) - Number(b.xtz_per_objkt)
}

export const OwnerSwaps = ({ swaps, handleCollect, handleCancel, proxyAdminAddress }) => {
  swaps = swaps.filter(e => parseInt(e.contract_version) === 2 && parseInt(e.status) === 0 && e.is_valid)
  console.log('v2', swaps)

  // if handle cancel is not passed in, the button won't be shown
  // We need to see if the proxy owns the swap, and double check it's the admin who is
  const { acc, proxyAddress } = useContext(HicetnuncContext)

  return (
    <div className={styles.container}>
      {swaps.sort(sortByPrice).map((swap, index) => {

        console.log(swap.creator, proxyAdminAddress)
        
        // Check if we should show a cancel button. If the user owns the swap, or is the admin of the proxy that owns it
        const showCancel = (swap.creator.address === acc?.address) || (proxyAdminAddress === acc?.address && swap.creator.address === proxyAddress)

        return (
          <div key={`${swap.id}-${index}`} className={styles.swap}>
            <div className={styles.issuer}>
              {swap.amount_left} ed.&nbsp;
              {swap.creator.name ? (
                <Button to={`/tz/${swap.creator.address}`}>
                  <Primary>{encodeURI(swap.creator.name)}</Primary>
                </Button>
              ) : (
                <Button to={`/tz/${swap.creator.address}`}>
                  <Primary>{walletPreview(swap.creator.address)}</Primary>
                </Button>
              )}
            </div>

            <div className={styles.buttons}>
              <Button onClick={() => handleCollect(swap.id, swap.price)}>
                <Purchase>
                  collect for {parseFloat(swap.price / 1000000)} tez
                </Purchase>
              </Button>

              {showCancel && (
                <Button onClick={() => handleCancel(swap.id)}>
                  <Purchase>cancel</Purchase>
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
