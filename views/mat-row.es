import React from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import { SlotitemIcon } from 'views/components/etc/icon'
import { UseitemIcon } from './useitem-icon'

const { __, __r } = window

const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// React Elements
const MatRow = ({ stage, day, assistants, upgrade, item, useitem, development, improvement }) => {
  const rowCnt = upgrade.icon ? 3 : 2

  let hishoCol = ''
  if (day === -1) {
    hishoCol = assistants.map(hisho => {
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
    hishoCol = assistants.map(hisho => <div key={hisho.name}>{hisho.name}</div>)
  }

  let stageRow = ''
  let star = ''
  switch (stage) {
    case 0:
      stageRow = <span><FontAwesome name="star" /> 1 ~ <FontAwesome name="star" /> 6 </span>
      break
    case 1:
      stageRow = <span><FontAwesome name="star" /> 6 ~ <FontAwesome name="star" /> MAX </span>
      break
    case 2:
      if (upgrade.level) {
        star = <span> <FontAwesome name="star" />{` ${upgrade.level}`}</span>
      }
      stageRow = (<div>
        <SlotitemIcon slotitemId={upgrade.icon} className="equip-icon" />
        {window.i18n.resources.__(upgrade.name)}
        {star}
      </div>)
      break
    default:
      console.error('unreachable code: stage is out of range')
  }

  return (
    <tr>
      {
        stage === 0 &&
          <td rowSpan={rowCnt}>{hishoCol}</td>
      }
      <td>
        {stageRow}
      </td>
      <td>
        {development[0]}({development[1]})
      </td>
      <td>
        {improvement[0]}({improvement[1]})
      </td>
      <td>
        <div>
          {
          item.icon ?
            <span>
              {item.count} ×
            <SlotitemIcon
              slotitemId={item.icon}
              className="equip-icon"
            />
              {__r(item.name)}
            </span> : ''
        }
        </div>
        <div>
          {
          useitem.icon ?
            <span>
              {useitem.count} ×
            <UseitemIcon
              useitemId={useitem.icon}
              className={'useitem'}
            />
              {__r(useitem.name)}
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
  assistants: PropTypes.arrayOf(
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
