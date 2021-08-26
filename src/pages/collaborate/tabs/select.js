import React, { useState, useContext, useEffect } from 'react'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Container, Padding } from '../../../components/layout'
import { Button, Purchase } from '../../../components/button'
import styles from '../../../components/collab/styles.module.scss'
import { ProxyAddressSelector } from '../../../components/collab/select/ProxyAddressSelector'

export const SelectProxyContract = () => {

  const { proxyAddress, setProxyAddress } = useContext(HicetnuncContext)

  return (
    <Container>

      <ProxyAddressSelector />

      {proxyAddress && (
        <Padding>
          <p className={styles.mb1}>You are now signed in with your collaborative address and can mint OBJKTs with it.</p>
          <Button onClick={() => setProxyAddress(null)}>
            <Purchase>Sign out of collaborative contract</Purchase>
          </Button>
        </Padding>
      )}

    </Container>
  )
}

