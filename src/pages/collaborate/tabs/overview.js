import React, { useState, useContext, useEffect } from 'react'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Container, Padding } from '../../../components/layout'
import styles from '../../../components/collab/styles.module.scss'
import { fetchGraphQL, getCollabsForAddress } from '../../../data/hicdex'
import { CollabParticipantInfo } from '../../../components/collab/manage/CollabParticipantInfo'

export const CollabContractsOverview = () => {

    const { acc } = useContext(HicetnuncContext)
    const [collabs, setCollabs] = useState([])

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
    }, [])

    return (
        <Container>
            <Padding>

                {collabs.length > 0 && (
                    <div>
                        <p className={styles.mb1}>You are a participant in these collabs:</p>
                        <ul>
                            {collabs.map(collab => (
                                <CollabParticipantInfo collabData={collab} key={collab.contract_id} />
                            ))}
                        </ul>
                    </div>
                )}

                {collabs.length === 0 && (
                    <p>You aren’t part of any collaborations at the moment</p>
                )}
            </Padding>
        </Container>
    )
}

