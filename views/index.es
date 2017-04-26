import fs from 'fs-extra'
import path from 'path-extra'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Nav, NavItem, Col, Grid, Table } from 'react-bootstrap'
import _ from 'lodash'

import { Divider } from './Divider'
import { ItemInfoRow } from './ItemInfoRow'
import { DetailRow } from './DetailRow'

const { $, __, config } = window

const dataJson = fs.readJsonSync(path.join(__dirname, '..', 'assets', 'data.json'))
const DATA = _.sortBy(dataJson, ['icon', 'id'])

// React Elements
class ItemInfoArea extends Component {

  constructor(props) {
    super(props)

    let day = (new Date()).getUTCDay()
    if ((new Date()).getUTCHours() >= 15) {
      day = (day + 1) % 7
    }

    this.state = {
      day,
      highlights: config.get('plugin.ItemImprovement.highlights', []),
      rowsExpanded: {},
    }
  }


  getRows = () => {
    const day = this.state.day
    const rows = []

    for (const item of DATA) {
      const hishos = []
      for (const improvement of item.improvement) {
        for (const req of improvement.req) {
          for (const secretary of req.secretary) {
            // day = -1 means show all items
            if (day === -1) {
              hishos.push(__(window.i18n.resources.__(secretary)))
            } else if (req.day[day]) {
              hishos.push(__(window.i18n.resources.__(secretary)))
            }
          }
        }
      }
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
    }
    return rows
  }

  handleKeyChange = key => {
    this.setState({
      day: key,
      rowsExpanded: {},
    })
  }

  handleClickItem = id => {
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

  handleRowExpanded = (id, expanded) => {
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
      for (const row of rows) {
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
            clickCheckbox={this.handleClickItem.bind(this, row.id)}
            rowExpanded={rowExpanded}
            setExpanded={this.handleRowExpanded.bind(this, row.id)}
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
      }
      result = _.concat(highlighted, normal)
    }

    return (result)
  }


  render() {
    return (
      <Grid id="item-info-area">
        <div id="item-info-settings">
          <Divider text={__('Weekday setting')} />
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
          <Divider text={__('Improvement information')} />
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

ReactDOM.render(<ItemInfoArea />, $('#item-improvement'))
