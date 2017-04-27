import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Nav, NavItem, Col, Grid, Table } from 'react-bootstrap'
import _ from 'lodash'
import { Provider } from 'react-redux'
import { store } from 'views/create-store'

import { ItemInfoArea } from './ItemInfoArea'

const { $, __, config } = window

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
        <div style={{display: this.state.part === 'info' ? 'initial' : 'none'}} >
          <ItemInfoArea />
        </div>
        <div style={{display: this.state.part === 'starcraft' ? 'initial' : 'none'}} >
          placeholder for starcraft
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
