import { useState, useEffect, Fragment, useContext } from 'react'
import { groupShareTotal, validAddress } from '../../../components/collab/functions'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { Container, Padding } from '../../../components/layout'
import { CollaboratorTable, BenefactorsUI } from '../../../components/collab'
import { AddCollaboratorsButton } from '../../../components/collab/create/AddCollaboratorsButton'
import { ReviewStage } from '../../../components/collab/create/ReviewStage'
import styles from '../styles.module.scss'
import classNames from 'classnames'
// import { mockData } from '../../../components/collab/constants'
const mockCoreData = [{
    address: 'tz1cCkFpkSezV7TpmSBfKzAKADxBUXPjNsJD',
    shares: 95,
}]

const mockBenefactorData = [{
    address: 'tz1aPHze1U5BEEKrGYt3dvY6aAQEeiWm8jjK',
    shares: 5,
}]

export const CreateCollaboration = () => {

    const { acc } = useContext(HicetnuncContext)

    // Core collaborators and benefactors
    const [editCollaborators, setEditCollaborators] = useState(true)
    const [collaborators, setCollaborators] = useState([])
    const [benefactors, setBenefactors] = useState([])
    // const [collaborators, setCollaborators] = useState(mockCoreData)
    // const [benefactors, setBenefactors] = useState(mockBenefactorData)

    // For adding people not directly involved with the creation
    const [showBenefactorsUI, setShowBenefactorsUI] = useState(false);

    // For adding people not directly involved with the creation
    const [showReview, setShowReview] = useState(false);

    // Grand total of share allocation
    const totalShares = groupShareTotal(collaborators) + groupShareTotal(benefactors)

    // Check for completed entries - must have a share allocation and address
    const validCollaborators = collaborators.filter(c => !!c.shares && validAddress(c.address))

    useEffect(() => {
        if (benefactors.length === 0) {
            setShowBenefactorsUI(false)
        }
    }, [showReview, benefactors.length])

    useEffect(() => {
        if (!editCollaborators && !showBenefactorsUI) {
            setShowBenefactorsUI(true)
        }

        if (validCollaborators.length === 0) {
            setCollaborators([])
        }
    }, [editCollaborators, showBenefactorsUI])

    // When the user clicks a percentage button in the benefactors UI
    const _calculateShares = (index, percentage) => {
        const benefactor = benefactors[index]
        const updatedBenefactors = [...benefactors]

        console.log("_calculateShares", index, percentage)

        updatedBenefactors[index] = {
            ...benefactor,
            shares: Math.ceil(totalShares * percentage / 100),
        }

        // Now what's left?
        const remaining = totalShares - groupShareTotal(updatedBenefactors)

        // Redistribute to collaborators
        const updatedCollaborators = collaborators.map(collaborator => {
            const proportion = collaborator.shares / groupShareTotal(collaborators)
            const newAllocation = Math.floor(proportion * remaining * 100) / 100

            return {
                ...collaborator,
                shares: newAllocation,
            }
        })

        setBenefactors(updatedBenefactors)
        setCollaborators(updatedCollaborators)
    }

    const totalParticipants = validCollaborators.length + benefactors.length
    const notesClass = classNames(styles.mb2, styles.muted)
    const minimalView = !editCollaborators && (showBenefactorsUI || showReview)
    const showCollaboratorsTable = editCollaborators || validCollaborators.length > 0


    if (!acc) {
        return (
            <Container>
                <Padding>Please sync your wallet to create a collaboration</Padding>
            </Container>
        )
    }

    return showReview ? (
        <ReviewStage
            collaborators={validCollaborators}
            benefactors={benefactors}
            onEdit={() => setShowReview(false)}
        />
    ) :
        (
            <Container>
                <Padding>
                    <h1 className={validCollaborators.length === 0 ? styles.mb1 : styles.mb2}>
                        <strong>core collaborators</strong>
                    </h1>

                    {validCollaborators.length === 0 && showCollaboratorsTable && (
                        <Fragment>
                            <p className={notesClass}>Note: shares don’t have to add up to 100% - splits are calculated as proportions of the total shares.</p>
                            <p className={notesClass}>You can paste multiple addresses to get an auto split</p>
                        </Fragment>
                    )}

                    {showCollaboratorsTable && (
                        <CollaboratorTable
                            collaborators={editCollaborators ? collaborators : validCollaborators}
                            setCollaborators={setCollaborators}
                            minimalView={minimalView}
                            onEdit={() => setEditCollaborators(true)}
                        />
                    )}

                    {!showCollaboratorsTable && (
                        <p className={styles.muted}>No core collaborators</p>
                    )}

                    {!minimalView && (
                        <AddCollaboratorsButton
                            threshold={0}
                            collaborators={collaborators}
                            onClick={() => setEditCollaborators(false)}
                        />
                    )}

                    {showBenefactorsUI && (
                        <BenefactorsUI
                            totalParticipants={totalParticipants}
                            totalShares={totalShares}
                            benefactors={benefactors}
                            setBenefactors={setBenefactors}
                            minimalView={showReview}
                            onComplete={() => setShowReview(true)}
                            onSelectPercentage={(index, percentage) => _calculateShares(index, percentage)}
                        />
                    )}

                </Padding>

            </Container>

        )
}