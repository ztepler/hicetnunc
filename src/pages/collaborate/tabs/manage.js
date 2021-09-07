import React, { useState, useContext, useEffect, Fragment } from 'react'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Container, Padding } from '../../../components/layout'
import styles from '../../../components/collab/styles.module.scss'
import { fetchGraphQL, getCollabsForAddress } from '../../../data/hicdex'
import { CollabParticipantInfo } from '../../../components/collab/manage/CollabParticipantInfo'
import { Button, Purchase, Secondary } from '../../../components/button'
import classNames from 'classnames'
import { Input } from '../../../components/input'

export const CollabContractsOverview = ({ showAdminOnly = false }) => {

    const { acc, load, originatedContract, setProxyAddress } = useContext(HicetnuncContext)
    const [collabs, setCollabs] = useState([])
    const [showDetail, setShowDetail] = useState(false)

    // TODO - maybe allow manual input of a KT address
    // const [addAddressManually, setAddAddressManually] = useState(false)
    // const [manualAddress, setManualAddress] = useState('')

    useEffect(() => {
        if (!acc) {
            return
        }

        // On boot, see what addresses the synced address can manage 
        fetchGraphQL(getCollabsForAddress, 'GetCollabs', {
            address: acc.address,
        }).then(({ data, errors }) => {
            if (data) {
                const shareholderInfo = data.hic_et_nunc_shareholder.map(s => s.split_contract)
                const allContracts = shareholderInfo || []
                const contractsToShow = showAdminOnly ? allContracts.filter(contract => contract.administrator === acc.address) : allContracts
                setCollabs(contractsToShow)
            }
        })
    }, [acc])

    const headerStyle = classNames(styles.flex, styles.flexBetween)

    return (
        <Container>
            <Padding>

                {collabs.length > 0 && (
                    <div>
                        <div className={headerStyle}>
                            {showAdminOnly && (
                                <p className={styles.mb1}>You can mint with these collab contracts:</p>

                            )}

                            {!showAdminOnly && (
                                <p className={styles.mb1}>You are a participant in these collabs:</p>
                            )}

                            <div className={styles.mb2}>
                                <Button onClick={() => setShowDetail(!showDetail)}>
                                    <Purchase>{showDetail ? 'less detail' : 'more detail'}</Purchase>
                                </Button>
                            </div>
                        </div>

                        <ul>
                            {collabs.map(contract => (
                                <CollabParticipantInfo
                                    key={contract.address}
                                    collabData={contract}
                                    expanded={showDetail}
                                />
                            ))}
                        </ul>

                        {/* {!addAddressManually && (
                            <Button onClick={() => setAddAddressManually(true)}>
                                <Secondary>
                                    add address manually
                                </Secondary>
                            </Button>
                        )}

                        {addAddressManually && (
                            <div className={headerStyle}>
                                <Input
                                    type="text"
                                    label="KT address"
                                    onChange={event => setManualAddress(event.target.value)}
                                    placeholder="KT..."
                                    value={manualAddress}
                                    autoFocus={true}
                                />
                                <Button onClick={() => setProxyAddress(manualAddress)}>
                                    <Purchase>
                                        sign in
                                    </Purchase>
                                </Button>
                            </div>
                        )} */}
                    </div>
                )}

                {collabs.length === 0 && (
                    <p>{originatedContract ? 'Your collab contract is being created... please wait' : (load ? 'Loading...' : 'You aren’t part of any collaborations at the moment')}</p>
                )}

            </Padding>
        </Container>
    )
}

