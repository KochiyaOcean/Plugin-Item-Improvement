import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Nav, NavItem, Col, Grid } from 'react-bootstrap'
import _ from 'lodash'

import { improveData, getJSTDayofWeek } from '../improve-db'
import { ItemWrapper } from './item-wrapper'

const { __ } = window

const DATA = improveData

const getRows = day => {
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
    // const highlight = _.includes(this.state.highlights, item.id)
    if (hishos.length > 0) {
      const row = {
        id: item.id,
        icon: item.icon,
        type: window.i18n.resources.__(item.type),
        name: window.i18n.resources.__(item.name),
        hisho: hishos.join(' / '),
        // highlight,
      }
      rows.push(row)
    }
  })
  return rows
}

const ItemInfoArea = connect(state => ({
  plans: _.get(state, 'config.plugin.poi-plugin-starcraft.plans', {}),
}))(class itemInfoArea extends Component {
  static propTypes = {
    plans: PropTypes.object.isRequired,
  }

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
        <Grid className="vertical-center flex-0" style={{ minHeight: 45 }}>
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
        <Grid className="flex-1">
          {getRows(this.state.day).map((row, index) => (
            <ItemWrapper
              index={index}
              row={row}
              day={this.state.day}
              plans={this.props.plans[row.id]} />
          ))}
        </Grid>
      </div>
    )
  }
})

export { ItemInfoArea }
