import classnames from 'classnames'
import React, { Component } from 'react'
import { resolve } from 'path'
import { connect } from 'react-redux'
import { configSelector } from 'views/utils/selectors'
import _ from 'lodash'

class StaticUseitemIcon extends Component {
  static propTypes = {
    useitemId: React.PropTypes.number.isRequired,
    className: React.PropTypes.string.isRequired,
    useSVGIcon: React.PropTypes.bool.isRequired,
  }

  // all fields are primitives
  // so a shallow / deep comparison hardly making any differance
  shouldComponentUpdate = nextProps =>
    ! _.isEqual(nextProps, this.props)

  render() {
    const getClassName = (props, isSVG) => {
      const type = isSVG ? 'svg' : 'png'
      return classnames(type, props)
    }
    const {useitemId, className, useSVGIcon} = this.props
    const svgPath = resolve(__dirname, `../assets/svg/useitem-icon/${useitemId}.svg`)
    const pngPath = resolve(__dirname, `../assets/img/useitem-icon/${useitemId}.png`)

    return (
      <img
        src={useSVGIcon ? svgPath : pngPath}
        alt={`useitem #${useitemId}`}
        className={getClassName(className, useSVGIcon)}
      />)
  }
}

const UseitemIcon = connect(
  state => (
    { useSVGIcon: _.get(configSelector(state), 'poi.useSVGIcon') }
  )
)(StaticUseitemIcon)

export { UseitemIcon }
