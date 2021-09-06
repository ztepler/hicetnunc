import React, { useContext, useEffect, useState } from 'react'
import { Page, Container, Padding } from '../../components/layout'
import { Button, Primary } from '../../components/button'
import { CollabDisplay } from '../../components/collab/show/CollabDisplay'
import { CreateCollaboration } from './tabs'
import { Menu } from '../../components/menu'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { CollabContractsOverview } from './tabs/manage'

const TABS = [
    { title: 'manage', component: CollabContractsOverview },
    { title: 'create', component: CreateCollaboration },
]

const Collaborate = () => {
    const [tabIndex, setTabIndex] = useState(0)
    const Tab = TABS[tabIndex].component

    const { proxyAddress, originatedContract } = useContext(HicetnuncContext)

    // console.log("Main Collaborate component - originated contract is", originatedContract)

    // If an address is created, update the tab
    useEffect(() => {
        if (originatedContract) {
            setTabIndex(0)
        }
    }, [proxyAddress, originatedContract])

    // TODO: button to free from proxy contract? (that just makes field empty) // Done (SJ)
    // TODO: create new smart contract form with separate page? // Done (SJ)
    // TODO: add/remove tokens to contract?
    // TODO: validate proxy address? // Done (SJ)
    // TODO: any way to find all contracts that controlled by user pk? // Done (SJ)

    return (
        <Page title="proxy">
            <Container>
                <Padding>
                    <Menu>
                        {TABS.map((tab, index) => {
                            return (
                                <Button key={tab.title} onClick={() => setTabIndex(index)}>
                                    <Primary selected={tabIndex === index}>
                                        {tab.title}
                                    </Primary>
                                </Button>
                            )
                        })}
                    </Menu>
                </Padding>
            </Container>
            <Tab />
        </Page>
    )
}


export {
    Collaborate,
    CollabDisplay,
}