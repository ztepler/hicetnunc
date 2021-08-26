import React, { useContext } from 'react'
import { Container, Padding } from '../../../components/layout'
import { OwnerList } from '../../../components/owner-list'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { OwnerSwaps } from '../../../components/owner-swaps'

const _ = require('lodash')

export const Collectors = (nft) => {
  console.log("In Collectors", nft)

  const { owners, swaps, token_holders } = nft
  const { syncTaquito, collect, acc, getAccount, cancel } =
    useContext(HicetnuncContext)

  console.log("swaps", swaps)
  console.log("nft", nft)
  console.log('holders', token_holders)

  // sort swaps in ascending price order

  const orderedSwaps = _.orderBy(swaps, 'price', 'asc')

  /*   const filtered =
      (owners &&
        Object.keys(owners)
          .filter((s) => s.startsWith('tz'))
          .filter((s) => parseFloat(owners[s]) > 0) // removes negative owners
          .filter((e) => e !== 'tz1burnburnburnburnburnburnburjAYjjX') // remove burn wallet
          .map((s) => ({ amount: owners[s], wallet: s }))) ||
      [] */

  const handleCollect = (swap_id, price) => {
    if (acc == null) {
      syncTaquito()
      getAccount()
    } else {
      collect(swap_id, price)
    }
  }

  const proxyAdminAddress = nft.creator.is_split ? nft.creator.shares[0].administrator : null

  return (
    <>
      {orderedSwaps.length > 0 && (
        <Container>
          <Padding>
            <OwnerSwaps
              swaps={orderedSwaps}
              handleCollect={handleCollect}
              handleCancel={cancel}
              proxyAdminAddress={proxyAdminAddress}
            />
          </Padding>
        </Container>
      )}

      {/* {filtered.length === 0 ? undefined : ( */}
      <Container>
        <Padding>
          <OwnerList owners={token_holders} />
        </Padding>
      </Container>
      {/* )} */}
    </>
  )
}
