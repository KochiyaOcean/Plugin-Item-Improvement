import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ListGroup, ListGroupItem, Collapse } from 'react-bootstrap'
import { connect } from 'react-redux'
import _ from 'lodash'

import { ItemInfoRow } from './item-info-row'
import { DetailRow } from './detail-row'
import { EquipView } from './starcraft/equip-view'
import { itemLevelStatFactory } from './selectors'

export const ItemWrapper = connect(
  (state, { row }) => ({
    levels: itemLevelStatFactory(row.id)(state),
  })
)(class ItemWrapper extends Component {
  static propTypes = {
    row: PropTypes.object.isRequired,
    day: PropTypes.number.isRequired,
    plans: PropTypes.object.isRequired,
    // $equips: PropTypes.object.isRequired,
    levels: PropTypes.array.isRequired,
  }

  state = { expanded: false }

  handleClick = () => {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    const { row, day, plans, levels } = this.props
    const plan = plans[row.id] || {}
    const planArr = Object.keys(plan).map( k => {
      const star = parseInt(k,10)
      const planCount = plan[k]
      const actualCount = levels.filter( lvl => lvl >= star ).length
      return { star, planCount, actualCount }
    })
    let currentPlan = {}
    for (let i = 0; i <= 10; i++) {
      currentPlan = planArr[i] || currentPlan
      if (currentPlan.planCount > currentPlan.actualCount) break
    }
    return (
      <ListGroup className="expandable" onClick={this.handleClick}>
        <ListGroupItem>
          <ItemInfoRow
            key={row.id}
            id={row.id}
            icon={row.api_type[3]}
            name={row.api_name + row.id}
            assistants={row.assistants[day]}
            day={day}
            currentPlan={currentPlan}
          />
        </ListGroupItem>
        <Collapse
          in={this.state.expanded}
          unmountOnExit
        >
          <div>
            <ListGroupItem style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
              <DetailRow
                row={row}
                id={row.id}
                day={day}
              />
            </ListGroupItem>
            <ListGroupItem>
              <EquipView
                viewMode={false}
                hideTitle
                name={row.name}
                mstId={row.id}
                iconId={row.icon}
                plans={plan}
                levels={levels}
              />
            </ListGroupItem>
          </div>
        </Collapse>
      </ListGroup>
    )
  }
})

// mstId, name, iconId, plans, levels
