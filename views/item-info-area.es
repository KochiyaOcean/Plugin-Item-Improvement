import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Nav, NavItem, Col, Grid } from 'react-bootstrap'
import _ from 'lodash'

import { improveData, getJSTDayofWeek } from '../improve-db'
import { ItemWrapper } from './item-wrapper'

const { __ } = window

const DATA = improveData

const ItemInfoArea = connect(state => {
  const equips = _.get(state, 'info.equips', {})
  const equipLevels = {}
  Object.keys( equips ).map( rstId => {
    const { api_level } = equips[rstId]
    const mstId = equips[rstId].api_slotitem_id
    const l = equipLevels[mstId] || []
    l.push( api_level )
    equipLevels[mstId] = l
  })
  return {
    plans: _.get(state, 'config.plugin.poi-plugin-starcraft.plans', {}),
    $equips: _.get(state, 'const.$ships', {}),
    equipLevels,
  }
})(class itemInfoArea extends Component {
  static propTypes = {
    plans: PropTypes.object.isRequired,
    $equips: PropTypes.object.isRequired,
    equipLevels: PropTypes.object.isRequired,
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

  getRowType = id => {
    const levelsRaw = this.props.equipLevels[id] || []
    const levels = levelsRaw.map(x => typeof x === 'undefined' ? 0 : x)
    const plan = this.props.plans[id] || {}
    if (Object.keys(plan).length < 1) {
      return 0
    }
    const planArr = Object.keys(plan).map( k => {
      const star = parseInt(k,10)
      const planCount = plan[k]
      const actualCount = levels.filter( lvl => lvl >= star ).length
      return { star, planCount, actualCount }
    })
    const isNotFull = planArr.map(({ planCount, actualCount }) => planCount > actualCount)
      .reduce((a, b) => a || b, false)
    return isNotFull ? 2 : 1
  }

  getRows = day => {
    const notFullRows = []
    const fullRows = []
    const unsetRows = []
    DATA.map(item => {
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
        switch (this.getRowType(item.id)) {
          case 2: {
            notFullRows.push(row)
            break
          }
          case 1: {
            fullRows.push(row)
            break
          }
          default: {
            unsetRows.push(row)
          }
        }
      }
    })
    return _.concat(notFullRows, fullRows, unsetRows)
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
          {this.getRows(this.state.day).map((row, index) => (
            <ItemWrapper
              index={index}
              row={row}
              key={row.id}
              day={this.state.day}
              plans={this.props.plans}
              equipLevels={this.props.equipLevels}
              $equips={this.props.$equips} />
          ))}
        </Grid>
      </div>
    )
  }
})

export { ItemInfoArea }
