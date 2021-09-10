import React, { useState, useContext, useEffect, Fragment } from 'react'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Container, Padding } from '../../../components/layout'
import styles from '../../../components/collab/styles.module.scss'
import { fetchGraphQL, getCollabsForAddress } from '../../../data/hicdex'
import { CollabParticipantInfo } from '../../../components/collab/manage/CollabParticipantInfo'
import { Button, Purchase, Secondary } from '../../../components/button'
import classNames from 'classnames'
import { Input } from '../../../components/input'
import { CountdownTimer } from '../../../components/collab/manage/CountdownTimer'

export const CollabContractsOverview = ({ showAdminOnly = false }) => {

    const { acc, load, originatedContract, originationOpHash, setProxyAddress, setFeedback, findOriginatedContractFromOpHash } = useContext(HicetnuncContext)
    const [collabs, setCollabs] = useState([])
    const [loadingCollabs, setLoadingCollabs] = useState(true)
    const [showDetail, setShowDetail] = useState(false)
    // const [checkingForOrigination, setCheckingForOrigination] = useState(false)
    const [checkInterval, setCheckInterval] = useState(30)
    const [timerEndDate, setTimerEndDate] = useState()

    // TODO - maybe allow manual input of a KT address
    // const [addAddressManually, setAddAddressManually] = useState(false)
    // const [manualAddress, setManualAddress] = useState('')

    useEffect(() => {
        // const isChecking = originationOpHash && !checkingForOrigination
        // setCheckingForOrigination(isChecking)

        if (originationOpHash && !timerEndDate) {
            const timerDate = new Date()
            timerDate.setTime(timerDate.getTime() + (checkInterval * 1000))
            setTimerEndDate(timerDate)
        }

    }, [originationOpHash, timerEndDate])

    // useEffect(() => {
    //     if (originationOpHash) {
    //         let timerFunc = setTimeout(() => {
    //             console.log("Checking for contract")
    //         }, 10000);

    //         return () => clearTimeout(timerFunc);
    //     }
    // }, [originationOpHash])

    useEffect(() => {
        if (!acc) {
            return
        }

        setLoadingCollabs(true)
        console.log("Now checking for available collabs")

        // On boot, see what addresses the synced address can manage 
        fetchGraphQL(getCollabsForAddress, 'GetCollabs', {
            address: acc.address,
        }).then(({ data, errors }) => {
            
            setLoadingCollabs(false)
            
            if (data) {
                const shareholderInfo = data.hic_et_nunc_shareholder.map(s => s.split_contract)
                const allContracts = shareholderInfo || []
                const contractsToShow = showAdminOnly ? allContracts.filter(contract => contract.administrator === acc.address) : allContracts
                setCollabs(contractsToShow)
            }
        })
    }, [acc, originatedContract])

    const headerStyle = classNames(styles.flex, styles.flexBetween)

    const _onTimerComplete = () => {
        findOriginatedContractFromOpHash(originationOpHash)
        setCheckInterval(10)
    }

    return (
        <Container>
            <Padding>
                {originationOpHash && timerEndDate && (
                    <p className={styles.mb3}>Collab contract creation in progress... <CountdownTimer endDate={timerEndDate} onComplete={_onTimerComplete} /></p>
                )}

                {originatedContract && (
                    <div className={styles.mb3}>
                        <p><strong>collaborative contract created successfully!</strong></p>
                        <p>address: {originatedContract.address}</p>
                    </div>
                )}

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
                            {collabs.map(collab => (
                                <CollabParticipantInfo
                                    key={collab.contract.address}
                                    collabData={collab}
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

                {collabs.length === 0 && !originationOpHash && (
                    <p>{loadingCollabs ? 'Looking for collabs...' : 'You aren’t part of any collaborations at the moment'}</p>
                )}

            </Padding>
        </Container>
    )
}

