import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Nav, NavItem, Grid } from 'react-bootstrap'
import { Provider } from 'react-redux'
import { store } from 'views/create-store'

import { Divider } from './Divider'
import { ItemInfoArea } from './ItemInfoArea'
import { StarcraftArea } from './starcraft/StarcraftArea'

const { $ } = window

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
      <Grid>
        <Nav bsStyle="pills" activeKey={this.state.part} onSelect={this.handlePartChange}>
          <NavItem eventKey={'info'}>Information</NavItem>
          <NavItem eventKey={'starcraft'}>Starcraft</NavItem>
        </Nav>
        <Divider />
        <div style={{display: this.state.part === 'info' ? 'initial' : 'none'}} >
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
