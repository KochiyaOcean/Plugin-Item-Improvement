import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Nav, NavItem, Grid } from 'react-bootstrap'
import { Provider } from 'react-redux'
import { store } from 'views/create-store'

import { Divider } from './divider'
import { ItemInfoArea } from './item-info-area'
import { StarcraftArea } from './starcraft/starcraft-area'

const { $, __ } = window

window.store = store

class Main extends Component {
  constructor(props) {
    super(props)

    this.state = {
      part: 'info',
    }
  }

  handlePartChange = part => {
    this.setState( { part } )
  }

  render() {
    return (
      <Grid className="flex-column full-height">
        <Nav bsStyle="pills" activeKey={this.state.part} onSelect={this.handlePartChange}>
          <NavItem eventKey={'info'}>{__('Improvement information')}</NavItem>
          <NavItem eventKey={'starcraft'}>{__('Starcraft')}</NavItem>
        </Nav>
        <Divider />
        <div className="flex-column flex-1">
          <ItemInfoArea />
        </div>
        <div style={{display: this.state.part === 'starcraft' ? 'initial' : 'none'}} >
          <StarcraftArea />
        </div>
      </Grid>
    )
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  $('#item-improvement'))
