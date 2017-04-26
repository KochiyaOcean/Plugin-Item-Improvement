import React from 'react'
import FontAwesome from 'react-fontawesome'
import { SlotitemIcon } from 'views/components/etc/icon'

import UseitemIcon from './useitem-icon'

const { __, __r } = window

const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']


// React Elements
const MatRow = props => {
  const rowCnt = props.upgrade.icon !== 0 ? 3 : 2

  let hishoCol = ''
  if (props.day === -1) {
    hishoCol = props.hishos.map((hisho, index) => {
      let days = []
      hisho.day.forEach((v, i) => { if (v) days.push(__(WEEKDAY[i])) })
      if (days.length === 7) {
        days = ''
      } else {
        days = `(${days.join(' / ')})`
      }
      return (
        <div className={'hisho-col'} key={`${hisho.name}-${index}`}>
          {hisho.name}<br />
          <span className={'available-days'}>{days}</span>
        </div>
      )
    })
  } else {
    hishoCol = props.hishos.map((hisho, index) => <div key={`${hisho.name}-${index}`}>{hisho.name}</div>)
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
      if (props.upgrade.level) {
        star = <span> <FontAwesome name="star" />{` ${props.upgrade.level}`}</span>
      }
      stage = (<div>
        <SlotitemIcon slotitemId={props.upgrade.icon} />
        {window.i18n.resources.__(props.upgrade.name)}
        {star}
      </div>)
      break
  }

  const useitem = props.useitem || {}

  return (
    <tr>
      {
        props.stage === 0 ?
          <td rowSpan={rowCnt}>{hishoCol}</td>
        : null
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
          props.item.icon ?
            <span>
              {props.item.count} ×
            <SlotitemIcon
              slotitemId={props.item.icon}
            />
              {__r(props.item.name)}
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

export { MatRow }
