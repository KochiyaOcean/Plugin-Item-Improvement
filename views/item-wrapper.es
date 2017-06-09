import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ListGroup, ListGroupItem, Collapse } from 'react-bootstrap'

import { ItemInfoRow } from './item-info-row'
import { DetailRow } from './detail-row'

export class ItemWrapper extends Component {
  static propTypes = {
    row: PropTypes.object.isRequired,
    day: PropTypes.number.isRequired,
    plans: PropTypes.object.isRequired,
  }
  state = { expanded: false }
  handleClick = () => {
    this.setState({ expanded: !this.state.expanded })
  }
  render() {
    const { row, day, plans } = this.props
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
          unmountOnExit>
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
