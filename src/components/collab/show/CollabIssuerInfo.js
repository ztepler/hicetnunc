import { PATH } from '../../../constants'
import { walletPreview } from '../../../utils/string'
import { Button, Primary } from '../../button'
import styles from '../styles.module.scss'

export const CollabIssuerInfo = ({ creator }) => {
    const { name, address } = creator

    return (
        <div className={styles.relative}>
            <a className={styles.issuerBtn} href={`${PATH.COLLAB}/${address}`}>
                <Primary>{name !== "" ? name : walletPreview(address)}</Primary>
            </a>
            {/* Some kind of dropdown of collaborators info */}
        </div>
    )
}