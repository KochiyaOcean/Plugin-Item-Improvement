import React, { Component } from 'react'

import {
  Button,
} from 'react-bootstrap'

import { starText, modifyPlans } from './utils'
const { __ } = window

// props:
// - mstId, star, planCount, actualCount, viewMode
class PlanView extends Component {
  handleRemove = () => {
    const { mstId, star } = this.props
    modifyPlans( plans => {
      const newPlans = { ... plans }
      newPlans[mstId] = { ... plans[mstId] }
      delete newPlans[mstId][star]
      return newPlans
    })
  }
  render() {
    const { star, planCount, actualCount, viewMode } = this.props
    const done = actualCount >= planCount
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        fontSize: "16px"}}>
        <div key="1" style={{flex: 1}} className="star-text">{starText(star)}</div>
        <div key="2" style={{
          flex: 1, display: "flex",
          justifyContent: viewMode ? "flex-end" : "flex-start"}}>
          <div className={done ? "text-success" : "text-danger"}>{actualCount}</div>
          <div style={{marginLeft:"2px"}}>/{planCount}</div>
        </div>
        { ! viewMode && (
            <div key="3">
              <Button
                  onClick={this.handleRemove}
                  bsStyle="warning">{__("Remove")}
              </Button>
            </div>)
        }
      </div>)
  }
}

export {
  PlanView,
}
