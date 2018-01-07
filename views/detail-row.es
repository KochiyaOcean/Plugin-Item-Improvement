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

    let upgradeInfo
    let stages = [1, 2]
    if (upgrade) {
      const [itemId, star] = upgrade
      const item = _.get($equips, [itemId, 'api_type', 3])
      const name = _.get($equips, [itemId, 'api_name'])
      upgradeInfo = [item, star, name]
      stages = [1, 2, 3]
    }

    stages.forEach(stage => {
      const [dev, ensDev, imp, ensImp, extra, count] = resource[stage]
      let item
      let useitem
      let name

      if (_.isString(extra)) {
        item = 0
        useitem = extra.replace(/\D/g, '')
        name = _.get($useitems, [useitem, 'api_name'])
      } else {
        item = _.get($equips, [extra, 'api_type', 3])
        useitem = 0
        name = _.get($equips, [extra, 'api_name'])
      }

      result.push(
        <MatRow
          stage={stage - 1}
          development={[dev, ensDev]}
          improvement={[imp, ensImp]}
          item={[item, count, name]}
          useitem={[useitem, count, name]}
          upgrade={upgradeInfo}
          hishos={assistants}
          day={day}
          key={`${stage}-${day}-${JSON.stringify(assistants)}`}
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
  rowExpanded: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
}

export { DetailRow }
