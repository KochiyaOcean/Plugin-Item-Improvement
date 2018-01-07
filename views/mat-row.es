import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import { SlotitemIcon } from 'views/components/etc/icon'
import { UseitemIcon } from './useitem-icon'

const { __, __r } = window

const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// React Elements
const MatRow = props => {
  const rowCnt = props.upgrade ? 3 : 2

  let hishoCol = ''
  if (props.day === -1) {
    hishoCol = props.hishos.map(hisho => {
      let days = []
      hisho.day.forEach((v, i) => {
        if (v) days.push(__(WEEKDAY[i]))
      })
      if (days.length === 7) {
        days = ''
      } else {
        days = `(${days.join(' / ')})`
      }
      return (
        <div className="hisho-col" key={hisho.name}>
          {hisho.name}<br />
          <span className="available-days">{days}</span>
        </div>
      )
    })
  } else {
    hishoCol = props.hishos.map(hisho => <div key={hisho.name}>{hisho.name}</div>)
  }

  let stage = ''
  let star = ''
  switch (props.stage) {
    case 0:
      stage = <span><FontAwesome name="star" /> 1 ~ <FontAwesome name="star" /> 6 </span>
      break
    case 1:
      stage = <span><FontAwesome name="star" /> 6 ~ <FontAwesome name="star" /> MAX </span>
      break
    case 2:
      if (props.upgrade[1]) {
        star = <span> <FontAwesome name="star" />{` ${props.upgrade[1]}`}</span>
      }
      stage = (<div>
        <SlotitemIcon slotitemId={props.upgrade[0]} className="equip-icon" />
        {window.i18n.resources.__(props.upgrade[2])}
        {star}
      </div>)
      break
    default:
      console.error('unreachable code: stage is out of range')
  }

  console.log(props.stage)

  const { item, useitem } = props
  return (
    <tr>
      {
        props.stage === 0 &&
          <td rowSpan={rowCnt}>{hishoCol}</td>
      }
      <td>
        {stage}
      </td>
      <td>
        {props.development[0]}({props.development[1]})
      </td>
      <td>
        {props.improvement[0]}({props.improvement[1]})
      </td>
      <td>
        <div>
          {
          item[0] ?
            <span>
              {item[1]} ×
            <SlotitemIcon
              slotitemId={item[0]}
              className="equip-icon"
            />
              {__r(item[2])}
            </span> : ''
        }
        </div>
        <div>
          {
          useitem[0] ?
            <span>
              {useitem[1]} ×
            <UseitemIcon
              useitemId={useitem[0]}
              className={'useitem'}
            />
              {__r(useitem[2])}
            </span> : ''
        }
        </div>
      </td>
    </tr>
  )
}

MatRow.propTypes = {
  day: PropTypes.number.isRequired,
  development: PropTypes.arrayOf(PropTypes.number).isRequired,
  improvement: PropTypes.arrayOf(PropTypes.number).isRequired,
  stage: PropTypes.number.isRequired,
  item: PropTypes.shape({
    count: PropTypes.number.isRequired,
    icon: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  upgrade: PropTypes.shape({
    level: PropTypes.number.isRequired,
    icon: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  useitem: PropTypes.shape({
    count: PropTypes.number,
    icon: PropTypes.number,
    name: PropTypes.string,
  }),
  hishos: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.arrayOf(PropTypes.bool).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
}

MatRow.defaultProps = {
  useitem: {},
}

export { MatRow }
