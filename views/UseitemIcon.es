import classnames from 'classnames'
import React, { Component } from 'react'
import { resolve } from 'path'

const getClassName = (props, isSVG) => {
  const type = isSVG ? 'svg' : 'png'
  return classnames(type, props)
}

class iconConf {
  constructor() {
    this.callbacks = new Map()
  }
  setConf = val => {
    this.callbacks.forEach(f => f(val))
  }
  reg = (key, func) => {
    this.callbacks.set(key, func)
  }
  unreg = key => {
    this.callbacks.delete(key)
  }
}

const iconConfSetter = new iconConf()

const setIcon = (path, val) => {
  if (path === 'poi.useSVGIcon') {
    iconConfSetter.setConf(val)
  }
}

config.addListener('config.set', setIcon)

window.addEventListener('unload', (e) => {
  config.removeListener('config.set', setIcon)
})

class UseitemIcon extends Component {
  static propTypes = {
    useitemId: React.PropTypes.number,
    className: React.PropTypes.string,
  }

  state = {
    useSVGIcon: config.get('poi.useSVGIcon', false),
  }

  shouldComponentUpdate = (nextProps, nextState) => (
    !(nextProps.useitemId === this.props.useitemId &&
      nextProps.className === this.props.className &&
      nextState.useSVGIcon === this.state.useSVGIcon)
  )

  setUseSvg = val => {
    this.setState({
      useSVGIcon: val,
    })
  }
  componentDidMount = () => {
    this.key = `${process.hrtime()[0]}${process.hrtime()[1]}`
    iconConfSetter.reg(this.key, this.setUseSvg)
  }
  componentWillUnmount = () => {
    iconConfSetter.unreg(this.key)
  }

  render(){
    const {useitemId, className} = this.props
    const {useSVGIcon} = this.state
    const svgPath = resolve(__dirname, `../assets/svg/useitem-icon/${useitemId}.svg`)
    const pngPath = resolve(__dirname, `../assets/img/useitem-icon/${useitemId}.png`)

    if(useSVGIcon) {
      return <img src={svgPath} className={getClassName(className, true)} />
    } else {
      return <img src={pngPath} className={getClassName(className, false)} />
    }
  }
}

export { UseitemIcon }
