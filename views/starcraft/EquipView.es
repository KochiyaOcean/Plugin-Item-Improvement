import React, { Component } from 'react'

import {
  Button,
  FormControl,
} from 'react-bootstrap'

import { SlotitemIcon } from 'views/components/etc/icon'

import { PlanView } from './PlanView'
import { PlanModifyControl } from './PlanModifyControl'

const { __, FontAwesome } = window
import { modifyPlans } from './utils'

// props:
// - mstId, name, iconId, plans, viewMode
class EquipView extends Component {
  handleRemove = mstId => () => {
    modifyPlans( plans => {
      const newPlans = { ... plans }
      delete newPlans[mstId]
      return newPlans
    })
  }

  render() {
    const {mstId, name, iconId, plans, levels, viewMode} = this.props
    // sort plans because its is not guaranteed to be ordered.
    const planArr = Object.keys( plans ).map( k => {
      const star = parseInt(k,10)
      const planCount = plans[k]
      const actualCount = levels.filter( lvl => lvl >= star ).length
      return {star, planCount, actualCount}
    })
    planArr.sort( (x,y) => x.star - y.star )

    if (viewMode && planArr.length === 0)
      return null

    return (
      <div>
        <div style={{
          display:"flex",
          borderBottom: "solid 1px #666",
          alignItems:"center"}}>
          <SlotitemIcon
              slotitemId={iconId} className="equip-icon" />
          <div style={{flex: 1}}>{name}</div>
          {
            // allow an equipment entity to be removed when it's empty
            planArr.length === 0 && (
              <Button
                  onClick={this.handleRemove(mstId)}
                  style={{margin: "5px"}}
                  bsStyle="warning" >
                {__("Remove")}
              </Button>)
          }
        </div>
        <div style={{
          width: "80%", maxWidth:"500px",
          margin: "auto", marginBottom: "2px", marginTop:"2px"}} >
          {
            planArr.map( (args, ind) => (
              <PlanView
                  viewMode={this.props.viewMode}
                  mstId={mstId}
                  key={ind}
                  { ... args } />
            ))
          }
          { !this.props.viewMode && (
              <PlanModifyControl
                  mstId={mstId}
                  plans={plans} />)
          }
        </div>
      </div>)
  }
}

// props:
// - equips
class AddNewEquipView extends Component {
  constructor() {
    super()
    this.state = {
      selected: "none",
    }
  }
  handleChange = (e) => {
    this.setState( { selected: e.target.value } )
  }
  handleAddItem = () => {
    const { selected } = this.state
    if (selected !== "none") {
      modifyPlans(plans => ({ ...plans, [selected]: {} }))
    } else {
      console.error( "trying adding an invaid equipment" )
    }
  }

  render() {
    return (
      <div style={{
        display: "flex",
        margin: "5px",
        fontSize: "12px",
        alignItems: "center"}} >
        <FontAwesome
            style={{marginRight: "10px"}}
            name="plus"
        />
        <FormControl
            style={{marginRight: "10px",fontSize:"14px"}}
            onChange={this.handleChange}
            value={this.state.selected}
            componentClass="select">
          <option key="none" value="none">{__("New equipment plan")}</option>
          {
            this.props.equips.map((equip, ind) =>
              <option
                  key={ind} value={equip.mstId}>
                {`${equip.mstId}: ${equip.name}`}
              </option>
            )
          }
        </FormControl>
        <Button
            disabled={this.state.selected ==="none"}
            onClick={this.handleAddItem}
            bsStyle="primary">{__("Add")}</Button>
      </div>
    )
  }
}

export {
  EquipView,
  AddNewEquipView,
}
