import React, { PropTypes } from 'react'
import { Table, Collapse } from 'react-bootstrap'

import { MaterialIcon } from 'views/components/etc/icon'
import { MatRow } from './MatRow'
import { improveTable } from '../improve-db'

const { __ } = window

const DetailRow = props => {
  const data = improveTable.get(props.id)
  const result = []
  data.improvement.map( improvement => {
    const hishos = []
    improvement.req.map( req => {
      req.secretary.map( secretary => {
        // day = -1 means show all items
        if (props.day === -1) {
          hishos.push({
            name: (__(window.i18n.resources.__(secretary))),
            day: req.day,
          })
        } else if (req.day[props.day]) {
          hishos.push({
            name: (__(window.i18n.resources.__(secretary))),
            day: req.day,
          })
        }
      })
    })

    // skip the entry if no secretary availbale for chosen day
    if (hishos.length === 0) {
      return
    }

    improvement.consume.material.forEach((mat, index) => {
      if (mat.improvement[0]) {
        result.push(
          <MatRow
            stage={index}
            development={mat.development}
            improvement={mat.improvement}
            item={mat.item}
            useitem={mat.useitem}
            upgrade={improvement.upgrade}
            hishos={hishos}
            day={props.day}
            key={`${index}-${props.day}-${JSON.stringify(hishos)}`}
          />
        )
      }
    })
  })

  return (
    <tr>
      <td colSpan={3} className="detail-td">
        <Collapse in={props.rowExpanded}>
          <div>
            <Table width="100%" bordered condensed className="detail-table">
              <thead>
                <tr>
                  <th style={{ width: '20%' }} />
                  <th style={{ width: '33%' }}>
                    <span>
                      <MaterialIcon materialId={1} />
                      {data.improvement[0].consume.fuel}
                    </span>
                    <span>
                      <MaterialIcon materialId={2} />
                      {data.improvement[0].consume.ammo}
                    </span>
                    <span>
                      <MaterialIcon materialId={3} />
                      {data.improvement[0].consume.steel}
                    </span>
                    <span>
                      <MaterialIcon materialId={4} />
                      {data.improvement[0].consume.bauxite}
                    </span>
                  </th>
                  <th style={{ width: '7%' }}><MaterialIcon materialId={7} /></th>
                  <th style={{ width: '7%' }}><MaterialIcon materialId={8} /></th>
                  <th style={{ width: '33%' }}>{__('Equipment')}</th>
                </tr>
              </thead>
              <tbody>
                {result}
              </tbody>
            </Table>
          </div>
        </Collapse>
      </td>
    </tr>
  )
}

DetailRow.propTypes = {
  rowExpanded: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
}

export { DetailRow }
