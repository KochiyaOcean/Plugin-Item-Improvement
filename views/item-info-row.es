import React, { Component, PropTypes } from 'react'
import { Checkbox } from 'react-bootstrap'
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

  handleExpanded = e => {
    if (e.target.tagName === 'INPUT') return
    this.props.setExpanded(!this.props.rowExpanded)
  }

  render() {
    return (
      <tr onClick={this.handleExpanded} className="expandable">
        <td style={{ paddingLeft: 20 }}>
          <Checkbox
            type="checkbox"
            className={'new-checkbox'}
            checked={this.props.highlight}
            onChange={this.props.clickCheckbox}
          />
          <SlotitemIcon slotitemId={this.props.icon} />
          {this.props.type}
        </td>
        <td>{this.props.name}</td>
        <td>{this.props.hisho}</td>
      </tr>
    )
  }
}

export { ItemInfoRow }
