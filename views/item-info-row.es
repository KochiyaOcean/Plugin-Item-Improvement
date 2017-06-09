import React, { Component, PropTypes } from 'react'
import { SlotitemIcon } from 'views/components/etc/icon'

class ItemInfoRow extends Component {
  static propTypes = {
    setExpanded: PropTypes.func.isRequired,
    rowExpanded: PropTypes.bool.isRequired,

    highlight: PropTypes.bool.isRequired,
    clickCheckbox: PropTypes.func.isRequired,

    hisho: PropTypes.string.isRequired,
    icon: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }

  state = {
    collapsed: false,
  }

  handleExpanded = e => {
    this.setState({ collapsed: !this.state.collapsed })
  }

  render() {
    return (
      <div className="item-simple-info">
        <SlotitemIcon slotitemId={this.props.icon} className="equip-icon" />
        <div className="item-name">
          {this.props.name}
        </div>
        <div className="item-hisho">
          {this.props.hisho}
        </div>
      </div>
    )
  }
}

export { ItemInfoRow }
