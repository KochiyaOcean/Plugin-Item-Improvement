import React, { Component } from 'react'

import {
  Button,
  FormControl,
} from 'react-bootstrap'

import NumericInput from 'react-numeric-input'
const { _, __, FontAwesome } = window
import { starText, modifyPlans } from './utils'

// props:
// - plans: star to plan count
class PlanModifyControl extends Component {
  constructor() {
    super()
    this.state = {
      star: 0,
      planCount: 1,
    }
  }
  handleChangeStar = e => {
    const star = parseInt(e.target.value, 10)
    this.setState({ star })
  }
  handleChangeCount = valAsNum => {
    // note that "valAsNum" could be "null"
    this.setState({ planCount: valAsNum })
  }
  // The button action depends on current state
  getCurrentAction = () => {
    if (typeof this.state.planCount !== "number")
      return "invalid"

    const { star, planCount } = this.state
    const oldPlanCount = this.props.plans[star]

    if (oldPlanCount) {
      // we are editing an existing one
      return planCount === 0 ? "remove" : "modify"
    } else {
      // we are creating a new one
      return planCount === 0 ? "invalid" : "add"
    }
  }
  handleAction = (action,{star,planCount}) => () => {
    if (action === "invalid")
      return

    const mstId = this.props.mstId
    if (action === "add" || action === "modify") {
      modifyPlans( plans => {
        const newPlans = { ... plans }
        // it's safe to assume that plans[mstId] must exist at this point
        newPlans[mstId] = { ... plans[mstId] }
        newPlans[mstId][star] = planCount
        return newPlans
      })
      return
    }
    if (action === "remove") {
      modifyPlans( plans => {
        const newPlans = { ... plans }
        // it's safe to assume that plans[mstId] must exist at this point
        newPlans[mstId] = { ... plans[mstId] }
        delete newPlans[mstId][star]
        return newPlans
      })
      return
    }

    console.error(`undefined action: ${action}`)
  }

  render () {
    const action = this.getCurrentAction()
    const [faIcon, btnStyle, btnText] =
      action === "add" ? ["plus", "primary", "Add"]
      : action === "remove" ? ["minus", "warning", "Remove"]
      : action === "modify" ? ["pencil", "success", "Modify"]
      : action === "invalid" ? ["ban", "danger", "Invalid"]
      : console.error(`invalid action: ${action}`)

    return (
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        minHeight: "50px"}}>
        <FontAwesome
            style={{marginRight: "10px", maxWidth: "100px"}}
            name={faIcon}
        />
        <FormControl
            value={this.state.star}
            onChange={this.handleChangeStar}
            style={{flex: 1, marginRight: "10px", maxWidth: "100px"}}
            componentClass="select">
          {
            _.range(0,10+1).map((star, ind) =>
              <option key={ind} value={star}>
                {starText(star)}
              </option>
            )
          }
        </FormControl>
        <div style={{flex: 1, marginRight: "10px", maxWidth: "100px"}} >
          <NumericInput
              onChange={this.handleChangeCount}
              min={0}
              value={this.state.planCount}
              className="form-control" />
        </div>
        <Button
            style={{width: "25%", maxWidth: "100px"}}
            disabled={action === "invalid"}
            onClick={this.handleAction(action,this.state)}
            bsStyle={btnStyle}>
          {__(btnText)}
        </Button>
      </div>)
  }
}

export {
  PlanModifyControl,
}
