import React, { Component, PropTypes } from 'react'
import { SlotitemIcon } from 'views/components/etc/icon'
import { starText } from './starcraft/utils'

class ItemInfoRow extends Component {
  static propTypes = {
    currentPlan: PropTypes.object.isRequired,

    hisho: PropTypes.string.isRequired,
    icon: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }

  state = {
    collapsed: false,
  }

  handleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed })
  }

  render() {
    const { star, actualCount, planCount } = this.props.currentPlan
    const done = actualCount >= planCount
    return (
      <div className="item-simple-info">
        <SlotitemIcon slotitemId={this.props.icon} className="equip-icon" />
        <div className="item-name">
          {this.props.name}
        </div>
        {
          !!planCount && (
            <div className="item-plan">
              <div key="1" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }} className="star-text">{starText(star)}</div>
              <div key="2" style={{
                flex: 1,
                display: 'flex',
              }}>
                <div className={done ? 'text-success' : 'text-danger'}>{actualCount}</div>
                <div className="text-divider">/</div>
                <div>{planCount < 9999 ? planCount : '∞'}</div>
              </div>
            </div>
          )
        }
        <div className="item-hisho">
          {this.props.hisho}
        </div>
      </div>
    )
  }
}

export { ItemInfoRow }
