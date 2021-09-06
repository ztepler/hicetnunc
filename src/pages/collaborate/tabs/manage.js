import React, { useState, useContext, useEffect, Fragment } from 'react'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Container, Padding } from '../../../components/layout'
import styles from '../../../components/collab/styles.module.scss'
import { fetchGraphQL, getCollabsForAddress } from '../../../data/hicdex'
import { CollabParticipantInfo } from '../../../components/collab/manage/CollabParticipantInfo'
import { Button, Purchase, Secondary } from '../../../components/button'
import classNames from 'classnames'

export const CollabContractsOverview = () => {

    const { acc, load, originatedContract } = useContext(HicetnuncContext)
    const [collabs, setCollabs] = useState([])
    const [showDetail, setShowDetail] = useState(false)

    useEffect(() => {
        // On boot, see what addresses the synced address can manage 
        fetchGraphQL(getCollabsForAddress, 'GetCollabs', {
            address: acc?.address,
        }).then(({ data, errors }) => {
            if (data) {
                const shareholderInfo = data.hic_et_nunc_shareholder.map(s => s.split_contract);
                setCollabs(shareholderInfo || [])
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
                            <p className={styles.mb1}>You are a participant in these collabs:</p>

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
                    </div>
                )}

                {collabs.length === 0 && (
                    <p>{originatedContract ? 'Your collab contract is being created... please wait' : (load ? 'Loading...' : 'You aren’t part of any collaborations at the moment')}</p>
                )}

            </Padding>
        </Container>
    )
}

