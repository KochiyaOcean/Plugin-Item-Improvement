import domtoimage from 'dom-to-image'

import React, { Component } from 'react'

import { connect } from 'react-redux'
import { store } from 'views/create-store'
import { prepareEquipTypeInfo } from './equiptype'
import { EquipCategoryView } from './EquipCategoryView'
import { ControlPanel } from './ControlPanel'
import { keyPlans } from './utils'

const { _, $, remote } = window

window.store = store

$('#fontawesome-css')
  .setAttribute('href', require.resolve('font-awesome/css/font-awesome.css'))

class Main extends Component {
  constructor(props) {
    super()
    this.state = { ...this.prepareAutoCollapse(props), viewMode: false }
    this.viewRef = null
  }

  prepareAutoCollapse(props) {
    const equipTypeCollapsed = {}
    const {equipTypes, equipTypeInfo, plans} = props
    Object.keys( equipTypes ).map( k => {
      const et = equipTypes[k]
      const ci = equipTypeInfo.catInfo[et.api_id]
      equipTypeCollapsed[k] =
        ! ci.group.some( mstId => plans[mstId])
    })

    return { equipTypeCollapsed }
  }

  handleToggle = k => () => {
    this.setState( prevState => {
      const newState = { ...prevState }
      newState.equipTypeCollapsed = { ...prevState.equipTypeCollapsed }
      newState.equipTypeCollapsed[k] = ! prevState.equipTypeCollapsed[k]
      return newState
    })
  }

  handleControlAction = action => {
    const { equipTypes } = this.props
    if (action === 'Auto') {
      this.setState( this.prepareAutoCollapse(this.props) )
      return
    }

    if (action === 'ExpandAll' || action === 'CollapseAll') {
      const collapsed = action === 'CollapseAll'
      const equipTypeCollapsed = {}
      Object.keys( equipTypes ).map( k => {
        equipTypeCollapsed[k] = collapsed
      })

      this.setState( { equipTypeCollapsed } )
      return
    }

    console.error( `undefined action: ${action}` )
  }

  handleToggleViewMode = () => {
    this.setState( { viewMode: ! this.state.viewMode } )
  }

  updateRef = newRef => { this.viewRef = newRef }

  handleRefToImage = () => {
    if (this.viewRef) {
      domtoimage
        .toPng(this.viewRef)
        .then( dataUrl => {
          remote.getCurrentWebContents().downloadURL(dataUrl)
        })
    }
  }

  render() {
    const { equipTypes, equipTypeInfo, plans, $equips, equipLevels } = this.props
    const { equipTypeCollapsed, viewMode } = this.state
    return (
      <div
          id="starcraft-root"
          style={{margin: "5px 10px 5px 5px"}} >
        <ControlPanel
            viewMode={viewMode}
            onToggleViewMode={this.handleToggleViewMode}
            onControlAction={this.handleControlAction}
            onExportAsImage={this.handleRefToImage}
        />
        <div ref={this.updateRef}>
          {
            Object.keys(equipTypes).map( (k,ind) => {
              const et = equipTypes[k]
              const ci = equipTypeInfo.catInfo[et.api_id]
              return (
                <EquipCategoryView
                    viewMode={viewMode}
                    key={ind}
                    collapsed={equipTypeCollapsed[k]}
                    onToggle={this.handleToggle(k)}
                    equipType={et}
                    catInfo={ci}
                    plans={plans}
                    $equips={$equips}
                    equipLevels={equipLevels}
                />)
            })
          }
        </div>
      </div>
    )
  }
}

const StarcraftArea = connect(
  state => {
    const equipTypeInfo = prepareEquipTypeInfo( state.const.$equips )
    const equipTypesRaw = state.const.$equipTypes

    const { $equips } = state.const
    const { equips } = state.info
    const equipLevels = {}
    Object.keys( equips ).map( rstId => {
      const { api_level, api_slotitem_id } = equips[rstId]
      const mstId = api_slotitem_id
      const l = equipLevels[mstId] || []
      l.push( api_level )
      equipLevels[mstId] = l
    })

    // plans[<equipment master id>] = undefined or object
    // plans[...][0 .. 10] = number of planned count
    // connected plans:
    const plans = _.get(state,'config.' + keyPlans, {})

    // filter equipTypes to remove empty categories
    // before any UI rendering happens
    const equipTypes = {}
    Object.keys(equipTypesRaw).map( k => {
      const et = equipTypesRaw[k]
      const ci = equipTypeInfo.catInfo[et.api_id]
      if (ci && ci.group.length > 0)
        equipTypes[k] = et
    })

    return {
      equipTypeInfo,
      equipTypes,
      plans,
      $equips,
      equipLevels,
    }
  })(Main)

export { StarcraftArea }
