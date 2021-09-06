import { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button, Primary, Secondary } from '../../components/button'
import { Container, Padding } from '../../components/layout'
import { renderMediaType } from "../../components/media-types";
import { ResponsiveMasonry } from "../../components/responsive-masonry";
import { PATH } from "../../constants";
import { HicetnuncContext } from "../../context/HicetnuncContext";
import { fetchGraphQL, getCollabTokensForAddress } from "../../data/hicdex";
import styles from './styles.module.scss';
import collabStyles from '../../components/collab/styles.module.scss'
import classNames from "classnames";

export const CollabsTab = ({ filter, wallet }) => {

    const chunkSize = 20
    const { acc } = useContext(HicetnuncContext)
    const [objkts, setObjkts] = useState([])
    const [items, setItems] = useState([])
    const [showUnverified, setShowUnverified] = useState(false)
    const [offset, setOffset] = useState(0)

    const address = wallet // NO! 

    console.log("Address / wallet is", address)

    useEffect(() => {

        fetchGraphQL(
            getCollabTokensForAddress,
            'GetCollabTokens',
            { address: wallet }
        ).then(({ errors, data }) => {
            if (errors) {
                console.error(errors)
            }

            let tokens = [];
            const result = data.hic_et_nunc_shareholder

            if (result) {
                result.forEach((contract) => tokens = tokens.concat(contract.split_contract.contract.tokens))
            }

            setObjkts(tokens)
        })

    }, [wallet])

    useEffect(() => {
        if (objkts.length === 0) {
            return
        }

        setItems(objkts.slice(0, offset + chunkSize))
    }, [offset, objkts])

    const loadMore = () => {
        setOffset(offset + chunkSize)
    }

    const hasMore = items.length < objkts.length

    const toolbarStyles = classNames(collabStyles.flex, collabStyles.mb2)

    // Only show unverified objkts if the user chooses to see them
    const itemsToShow = showUnverified ? items : items.filter(item => item.is_signed)

    const hasUnverifiedObjkts = items.some(i => !i.is_signed).length > 0

    return (
        <Container xlarge>
            {/* {this.state.filter && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        onClick={() => { this.creations() }}>
                        <div className={styles.tag}>
                            all
                        </div>
                    </Button>
                    <Button
                        onClick={() => {
                            this.creationsForSale();
                        }}>
                        <div className={styles.tag}>
                            for sale
                        </div>
                    </Button>
                    <Button
                        onClick={() => { this.creationsNotForSale() }}>
                        <div className={styles.tag}>
                            not for sale
                        </div>
                    </Button>
                </div>
            )} */}

            {hasUnverifiedObjkts && (
                <div className={toolbarStyles}>
                    <label>
                        <input type="checkbox" onChange={() => setShowUnverified(!showUnverified)} checked={showUnverified} />
                        include unverified OBJKTs
                    </label>
                </div>
            )}

            <InfiniteScroll
                dataLength={itemsToShow.length}
                next={loadMore}
                hasMore={hasMore}
                loader={undefined}
                endMessage={undefined}
            >
                <ResponsiveMasonry>
                    {itemsToShow.map((nft) => {
                        return (
                            <Button key={nft.id} to={`${PATH.OBJKT}/${nft.id}`}>
                                <div className={styles.container}>
                                    {renderMediaType({
                                        mimeType: nft.mime,
                                        artifactUri: nft.artifact_uri,
                                        displayUri: nft.display_uri,
                                        displayView: true
                                    })}
                                </div>
                            </Button>
                        )
                    })}
                </ResponsiveMasonry>
            </InfiniteScroll>
        </Container>
    )
}