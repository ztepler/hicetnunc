import React, { useState, useContext, useEffect } from 'react'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Container, Padding } from '../../../components/layout'
import { Input } from '../../../components/input'
import { Button, Curate, Purchase } from '../../../components/button'
import styles from '../../../components/collab/styles.module.scss'
import { ProxyAddressSelector } from '../../../components/collab/select/ProxyAddressSelector'

export const SelectProxyContract = () => {

  const { proxyAddress, setProxyAddress, originatedContract, acc } = useContext(HicetnuncContext)

  const [localProxyContractAddress, setLocalProxyContractAddress] = useState(proxyAddress)
  const [invalidAddress, setInvalidAddress] = useState(false)

  const _validateAddress = () => {

    // Ensure this is valid before assigning to global state
    const isValid = localProxyContractAddress.substr(0, 2) === 'KT' && localProxyContractAddress.length === 36

    if (isValid) {
      setProxyAddress(localProxyContractAddress)
    } else {
      if (localProxyContractAddress.length > 0) {
        setInvalidAddress(true)
      }
    }
  }

  // Listen for changes in Context
  useEffect(() => {
    if (originatedContract) {
      setLocalProxyContractAddress(originatedContract.address)
    }
  }, [originatedContract])

  useEffect(() => {
    setInvalidAddress(false)
  }, [localProxyContractAddress])

  return (
    <Container>
      {/* <Padding>
        <Input
          type="text"
          onChange={e => setLocalProxyContractAddress(e.target.value)}
          placeholder="collaborative contract address"
          label="collaborative contract address"
          value={localProxyContractAddress}
        />
      </Padding> */}

      {/* {invalidAddress && (
        <Padding>
          <p>Sorry - this is not a valid collaborative contract address</p>
        </Padding>
      )} */}

      {/* {!proxyAddress && (
        <Padding>
          <Button onClick={_validateAddress} fit>
            <Curate>Sign in with this collaborative contract</Curate>
          </Button>
        </Padding>
      )} */}
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

