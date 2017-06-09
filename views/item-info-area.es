import React, { Component } from 'react'
import { Nav, NavItem, Col, Grid, Table, ListGroup, ListGroupItem, Collapse } from 'react-bootstrap'
import { List, CellMeasurer, CellMeasurerCache, AutoSizer } from 'react-virtualized'
import _ from 'lodash'

import { Divider } from './divider'
import { ItemInfoRow } from './item-info-row'
import { DetailRow } from './detail-row'

import { improveData, getJSTDayofWeek } from '../improve-db'

const { __, config } = window

const DATA = improveData

const getRows = (day) => {
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
    //const highlight = _.includes(this.state.highlights, item.id)
    if (hishos.length > 0) {
      const row = {
        id: item.id,
        icon: item.icon,
        type: window.i18n.resources.__(item.type),
        name: window.i18n.resources.__(item.name),
        hisho: hishos.join(' / '),
        //highlight,
      }
      rows.push(row)
    }
  })
  return rows
}

const getRowsMemoized = _.memoize(getRows)

class ItemInfoArea extends Component {

  constructor(props) {
    super(props)
    this.state = {
      day: getJSTDayofWeek(),
    }
  }

  handleKeyChange = key => {
    this.setState({
      day: key,
    })
  }
  
  render() {
    return (
      <div className="flex-column flex-1">
        <Grid className="vertical-center" style={{flex: '0'}}>
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
        <Divider style={{flex: '0'}} />
        <Grid style={{flex: "1"}}>
          {getRowsMemoized(this.state.day).map((row, index) => (
            <ItemWrapper index={index} row={row} day={this.state.day} handleChildExpand={this.handleChildExpand} />
          ))}
        </Grid>
      </div>
    )
  }
}

class ItemWrapper extends Component {
  state = { expanded: false }
  handleClick = e => {
    this.setState({ expanded: !this.state.expanded })
  }
  refreshHeight = () => {
    this.props.handleChildExpand(this.props.index)
  }
  render() {
    const { row, day } = this.props
    return (
      <ListGroup className="expandable" onClick={this.handleClick}>
        <ListGroupItem>
          <ItemInfoRow
            key={row.id}
            id={row.id}
            icon={row.icon}
            type={row.type}
            name={row.name}
            hisho={row.hisho}
            highlight={row.highlight}
            day={day}
          />
        </ListGroupItem>
        <Collapse
          in={this.state.expanded}
          unmountOnExit={true}>
          <ListGroupItem>
            <DetailRow
              id={row.id}
              day={day} />
          </ListGroupItem>
        </Collapse>
      </ListGroup>
    )
  }
}

export { ItemInfoArea }
