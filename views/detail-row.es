import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'react-bootstrap'
import _ from 'lodash'
import { connect } from 'react-redux'

import { MaterialIcon } from 'views/components/etc/icon'
import { constSelector } from 'views/utils/selectors'
import { MatRow } from './mat-row'

const { __ } = window


const DetailRow = connect(state =>
  ({
    $const: constSelector(state) || {},
  })
)(({ row, day, $const: { $ships, $equips, $useitems } }) => {
  const result = []
  row.improvement.forEach(({ req, resource, upgrade }) => {
    const assistants = _(req)
      .flatMap(([days, ships]) => ships
        ? _(ships)
          .map(id => ({
            name: window.__(window.i18n.resources.__(_.get($ships, [id, 'api_name'], 'None'))),
            day: days,
          }))
          .value()
        : ({
          name: window.__('None'),
          day: days,
        })
      )
      .value()

    // skip the entry if no secretary availbale for chosen day
    if (assistants.length === 0) {
      return
    }

    const upgradeInfo = {
      icon: 0,
      id: 0,
      level: 0,
      name: '',
    }
    let stages = [1, 2]
    if (upgrade) {
      const [itemId, level] = upgrade
      upgradeInfo.id = itemId
      upgradeInfo.level = level
      upgradeInfo.icon = _.get($equips, [itemId, 'api_type', 3])
      upgradeInfo.name = _.get($equips, [itemId, 'api_name'])
      stages = [1, 2, 3]
    }

    stages.forEach(stage => {
      const [dev, ensDev, imp, ensImp, extra, count] = resource[stage]
      const item = {
        icon: 0,
        name: '',
        count: 0,
        id: 0,
      }
      const useitem = {...item}

      if (_.isString(extra)) {
        useitem.id = parseInt(extra.replace(/\D/g, ''), 10)
        useitem.icon = useitem.id
        useitem.name = _.get($useitems, [useitem.id, 'api_name'])
        useitem.count = count
      } else if (extra) {
        item.id = extra
        item.icon = _.get($equips, [extra, 'api_type', 3])
        item.name = _.get($equips, [extra, 'api_name'])
        item.count = count
      }

      result.push(
        <MatRow
          stage={stage - 1}
          development={[dev, ensDev]}
          improvement={[imp, ensImp]}
          item={item}
          useitem={useitem}
          upgrade={upgradeInfo}
          assistants={assistants}
          day={day}
          key={`${stage}-${day}-${upgradeInfo.id}`}
        />
      )
    })
  })
  const [fuel, ammo, steel, bauxite] = row.improvement[0].resource[0]


  return (
    <div>
      <Table width="100%" bordered condensed className="detail-table">
        <thead>
          <tr>
            <th style={{ width: '20%' }} />
            <th style={{ width: '33%' }}>
              <span>
                <MaterialIcon materialId={1} className="equip-icon" />
                {fuel}
              </span>
              <span>
                <MaterialIcon materialId={2} className="equip-icon" />
                {ammo}
              </span>
              <span>
                <MaterialIcon materialId={3} className="equip-icon" />
                {steel}
              </span>
              <span>
                <MaterialIcon materialId={4} className="equip-icon" />
                {bauxite}
              </span>
            </th>
            <th style={{ width: '7%' }}><MaterialIcon materialId={7} className="equip-icon" /></th>
            <th style={{ width: '7%' }}><MaterialIcon materialId={8} className="equip-icon" /></th>
            <th style={{ width: '33%' }}>{__('Equipment')}</th>
          </tr>
        </thead>
        <tbody>
          {result}
        </tbody>
      </Table>
    </div>
  )
})

DetailRow.propTypes = {
  id: PropTypes.number.isRequired,
}

export { DetailRow }
