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
  // so shallow / deep comparisons are hardly making any difference
  shouldComponentUpdate = nextProps =>
    ! _.isEqual(nextProps, this.props)

  render() {
    const {useitemId, className, useSVGIcon} = this.props
    const path = resolve(
      __dirname,
      useSVGIcon
      ? `../assets/svg/useitem-icon/${useitemId}.svg`
      : `../assets/img/useitem-icon/${useitemId}.png`)
    const classNames = classnames(
      useSVGIcon ? 'svg' : 'png',
      className)
    return (
      <img
        src={path}
        alt={`useitem #${useitemId}`}
        className={classNames}
      />)
  }
}

const UseitemIcon = connect(
  state => (
    { useSVGIcon: _.get(configSelector(state), 'poi.useSVGIcon') }
  )
)(StaticUseitemIcon)

export { UseitemIcon }
