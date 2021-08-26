import React, { Fragment, useContext } from 'react'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Button, Purchase } from '../../button'
import classNames from 'classnames'
import styles from '../styles.module.scss'
import { CollaboratorType } from '../constants'
import { PATH } from '../../../constants'
import { ParticipantList } from './ParticipantList'
import { Link } from 'react-scroll'

export const CollabParticipantInfo = ({ collabData }) => {

    const { proxyAddress, setProxyAddress, acc } = useContext(HicetnuncContext)
    const { administrator, contract, shareholder } = collabData

    const isAdmin = acc?.address === administrator;

    // Core participants
    const coreParticipants = shareholder
        .filter(({ holder_type }) => holder_type === CollaboratorType.CORE_PARTICIPANT);

    // Benefactors
    const benefactors = shareholder
        .filter(({ holder_type }) => holder_type === CollaboratorType.BENEFACTOR);

    // Combine various styles
    const listStyle = classNames(styles.flex, styles.flexBetween, styles.alignStart, styles.mb2, {
        [styles.border]: contract.address === proxyAddress,
    })

    // We'll show the name of the contract if set
    const { name, address } = contract

    return <li className={listStyle} key={address}>
        <div>
            {name && <h3><strong>{name}</strong></h3>}
            <p>
                <span className={styles.muted}>address:</span>
                <Link className={styles.link} to={`${PATH.ISSUER}/${address}`}>{address}</Link>
            </p> {/* <span className={styles.muted}>(admin)</span> */}

            {coreParticipants.length > 0 && (
                <ParticipantList title="participants" participants={coreParticipants} />)
            }

            {benefactors.length > 0 && (
                <Fragment>
                    <ParticipantList title="benefactors" participants={benefactors} />
                </Fragment>
            )}
        </div>

        {address !== proxyAddress && isAdmin && (
            <Button onClick={() => setProxyAddress(address, name)}>
                <Purchase>Use this contract</Purchase>
            </Button>
        )}

        {address === proxyAddress && isAdmin && (
            <Button onClick={() => setProxyAddress(null)}>
                <Purchase>Sign Out</Purchase>
            </Button>
        )}
    </li>
}