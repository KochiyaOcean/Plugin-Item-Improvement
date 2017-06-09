import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ListGroup, ListGroupItem, Collapse } from 'react-bootstrap'

import { ItemInfoRow } from './item-info-row'
import { DetailRow } from './detail-row'
import { EquipView } from './starcraft/equip-view'

export class ItemWrapper extends Component {
  static propTypes = {
    row: PropTypes.object.isRequired,
    day: PropTypes.number.isRequired,
    plans: PropTypes.object.isRequired,
    // $equips: PropTypes.object.isRequired,
    equipLevels: PropTypes.object.isRequired,
  }
  state = { expanded: false }
  handleClick = () => {
    this.setState({ expanded: !this.state.expanded })
  }
  render() {
    const { row, day, plans, equipLevels } = this.props
    const plan = plans[row.id] || {}
    const levelsRaw = equipLevels[row.id] || []
    const levels = levelsRaw.map(x => typeof x === 'undefined' ? 0 : x)
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
            icon={row.icon}
            type={row.type}
            name={row.name}
            hisho={row.hisho}
            highlight={row.highlight}
            day={day}
            currentPlan={currentPlan}
          />
        </ListGroupItem>
        <Collapse
          in={this.state.expanded}
          unmountOnExit>
          <div>
            <ListGroupItem style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
              <DetailRow
                id={row.id}
                day={day} />
            </ListGroupItem>
            <ListGroupItem>
              <EquipView
                viewMode={false}
                hideTitle
                name={row.name}
                mstId={row.id}
                iconId={row.icon}
                plans={plan}
                levels={levels} />
            </ListGroupItem>
          </div>
        </Collapse>
      </ListGroup>
    )
  }
}

// mstId, name, iconId, plans, levels
