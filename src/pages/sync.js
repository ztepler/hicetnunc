import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { HicetnuncContext } from '../context/HicetnuncContext'
import { Page, Container, Padding } from '../components/layout'
import { LoadingContainer } from '../components/loading'
import { Button, Primary } from '../components/button'
import { PATH } from '../constants'

export default class Sync extends Component {
  constructor(props) {
    super(props)

    this.state = {
      addr: '',
    }
  }

  static contextType = HicetnuncContext

  componentWillMount = async () => {
    if (this.context.acc == null) {
      await this.context.syncTaquito()
      await this.context.setAccount()
    } else {
      await this.context.setAccount()
    }
  }

  render() {
    const { proxyAddress, acc } = this.context
    const path = PATH[proxyAddress ? 'COLLAB' : 'ISSUER']

    return this.context.acc !== undefined ? (
      <Redirect to={`${path}/${proxyAddress || acc.address}`} />
    ) : (
      <Page title="">
        <Container>
          <Padding>
            <p>requesting permissions</p>
            <Button to="/sync">
              <Primary>try again?</Primary>
            </Button>
            <LoadingContainer />
          </Padding>
        </Container>
      </Page>
    )
  }
}
