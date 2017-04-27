import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Nav, NavItem, Col, Grid, Table } from 'react-bootstrap'
import _ from 'lodash'
import { Provider } from 'react-redux'
import { store } from 'views/create-store'

import { ItemInfoRow } from './ItemInfoRow'
import { DetailRow } from './DetailRow'

import { improveData, getJSTDayofWeek } from '../improve-db'

const { $, __, config } = window

const DATA = improveData

window.store = store

const Divider = () => (
  <hr
    className="divider"
    style={{width: '100%'}}
  />)

// React Elements
class ItemInfoArea extends Component {

  constructor(props) {
    super(props)

    this.state = {
      day: getJSTDayofWeek(),
      highlights: config.get('plugin.ItemImprovement.highlights', []),
      rowsExpanded: {},
    }
  }

  getRows = () => {
    const { day } = this.state
    const rows = []

    DATA.map( item => {
      const hishos = []
      item.improvement.map( improvement =>
        improvement.req.map( req =>
          req.secretary.map( secretary => {
            if (day === -1 || req.day[day]) {
              hishos.push(__(window.i18n.resources.__(secretary)))
            }
          })))
      const highlight = _.includes(this.state.highlights, item.id)
      if (hishos.length > 0) {
        const row = {
          id: item.id,
          icon: item.icon,
          type: window.i18n.resources.__(item.type),
          name: window.i18n.resources.__(item.name),
          hisho: hishos.join(' / '),
          highlight,
        }
        rows.push(row)
      }
    })
    return rows
  }

  handleKeyChange = key => {
    this.setState({
      day: key,
      rowsExpanded: {},
    })
  }

  handleClickItem = id => () => {
    let highlights = _.clone(this.state.highlights)
    if (_.includes(highlights, id)) {
      highlights = highlights.filter(v => v !== id)
    } else {
      highlights.push(id)
    }
    config.set('plugin.ItemImprovement.highlights', highlights)

    this.setState({
      highlights,
    })
  }

  handleRowExpanded = id => expanded => {
    const rowsExpanded = _.clone(this.state.rowsExpanded)
    rowsExpanded[id] = expanded
    this.setState({
      rowsExpanded,
    })
  }

  renderRows = () => {
    const rows = this.getRows()
    const highlighted = []
    const normal = []
    let result = []
    if (rows != null) {
      rows.map( row => {
        const ref = row.highlight ? highlighted : normal

        const rowExpanded = this.state.rowsExpanded[row.id] || false
        ref.push(
          <ItemInfoRow
            key={row.id}
            icon={row.icon}
            type={row.type}
            name={row.name}
            hisho={row.hisho}
            highlight={row.highlight}
            clickCheckbox={this.handleClickItem(row.id)}
            rowExpanded={rowExpanded}
            setExpanded={this.handleRowExpanded(row.id)}
          />
        )
        ref.push(
          <DetailRow
            key={`detail-${row.id}`}
            id={row.id}
            rowExpanded={rowExpanded}
            day={this.state.day}

          />
        )
      })
      result = _.concat(highlighted, normal)
    }

    return (result)
  }

  render() {
    return (
      <Grid id="item-info-area">
        <div id="item-info-settings">
          <Divider />
          <Grid className="vertical-center">
            <Col xs={12}>
              <Nav bsStyle="pills" activeKey={this.state.day} onSelect={this.handleKeyChange}>
                <NavItem eventKey={0}>{__('Sunday')}</NavItem>
                <NavItem eventKey={1}>{__('Monday')}</NavItem>
                <NavItem eventKey={2}>{__('Tuesday')}</NavItem>
                <NavItem eventKey={3}>{__('Wednesday')}</NavItem>
                <NavItem eventKey={4}>{__('Thursday')}</NavItem>
                <NavItem eventKey={5}>{__('Friday')}</NavItem>
                <NavItem eventKey={6}>{__('Saturday')}</NavItem>
                <NavItem eventKey={-1}>{__('All')}</NavItem>
              </Nav>
            </Col>
          </Grid>
          <Divider />
          <Grid>
            <Table bordered condensed hover id="main-table">
              <thead className="item-table">
                <tr>
                  <th style={{ width: '30%' }}><div style={{ paddingLeft: '55px' }}>{__('Type')}</div></th>
                  <th style={{ width: '40%' }}>{__('Name')}</th>
                  <th style={{ width: '30%' }}>{__('2nd Ship')}</th>
                </tr>
              </thead>
              <tbody>
                {this.renderRows()}
              </tbody>
            </Table>
          </Grid>
        </div>
      </Grid>
    )
  }
}

ReactDOM.render(
  <Provider store={store}>
    <ItemInfoArea />
  </Provider>,
  $('#item-improvement'))
