import { useState } from 'react'
import { PATH } from '../../../constants'
import { walletPreview } from '../../../utils/string'
import { Button, Primary } from '../../button'
import styles from '../styles.module.scss'

export const CollabIssuerInfo = ({ creator }) => {
    const { name, address } = creator
    const [showCollabSummary, setShowCollabSummary] = useState(false)

    return (
        <div className={styles.relative}>
            <a className={styles.issuerBtn} href={`${PATH.COLLAB}/${address}`} onMouseOver={() => setShowCollabSummary(true)} onMouseOut={() => setShowCollabSummary(false)}>
                <Primary>{name !== "" ? name : walletPreview(address)}</Primary>
            </a>
            {showCollabSummary && (
                <div className={styles.collabInfo}>
                    <p>Collab Summary</p>
                </div>
            )}
            {/* Some kind of dropdown of collaborators info */}
        </div>
    )
}