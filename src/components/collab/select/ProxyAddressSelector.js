import React, { useState, useContext, useEffect } from 'react'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { fetchGraphQL, getAvailableCollabAddresses } from '../../../data/hicdex'
import styles from '../../../components/collab/styles.module.scss'
import { Button, Purchase } from '../../button'
import classNames from 'classnames'

export const ProxyAddressSelector = () => {

    const [availableProxyAddresses, setAvailableProxyAddresses] = useState([])
    const { proxyAddress, setProxyAddress, originatedContract, acc } = useContext(HicetnuncContext)

    useEffect(() => {
        // On boot, see what addresses the synced address can manage 
        fetchGraphQL(getAvailableCollabAddresses, 'GetCollabContracts', {
            address: acc?.address,
        }).then(({ data, errors }) => {
            if (data) {
                setAvailableProxyAddresses(data.hic_et_nunc_splitcontract || [])
            }
        })
    }, [])


    return availableProxyAddresses.length > 0 ? (
        <div className={styles.mt3}>
            <p className={styles.mb1}>Here are the contracts you can use</p>
            <ul>
                {availableProxyAddresses.map(proxy => {
                    const { address, shares } = proxy.contract
                    const coreParticipants = shares[0].shareholder
                    const listStyle = classNames(styles.flex, styles.flexBetween, styles.alignStart, styles.mb2, {
                        [styles.border]: address === proxyAddress,
                    })

                    return <li className={listStyle} key={address}>
                        <div>
                            <p>{address}</p>
                            <p className={styles.muted}>{coreParticipants && coreParticipants.map(({ holder }, index) => (
                                <span key={holder.name}>{holder.name}{index < coreParticipants.length - 1 && ", "}</span>
                            ))}</p>
                        </div>
                        {address !== proxyAddress && (
                            <Button onClick={() => setProxyAddress(address)}>
                                <Purchase>Use this contract</Purchase>
                            </Button>
                        )}

                        {address === proxyAddress && (
                            <Button onClick={() => setProxyAddress(null)}>
                                <Purchase>Sign Out</Purchase>
                            </Button>
                        )}
                    </li>
                })}
            </ul>
        </div>
    ) : null
}