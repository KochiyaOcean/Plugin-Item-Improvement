/*

   data format for improveData:

   - an array of

       - icon
       - id (master id)
       - name
       - type
       - improvement: an array of

           - consume
           - upgrade
               - icon
               - level
               - name
           - req: an array


 */

import fs from 'fs-extra'
import path from 'path-extra'
import _ from 'lodash'

const dataRaw = fs.readJsonSync(path.join(__dirname, 'assets', 'data.json'))
const improveData = _.sortBy(dataRaw, ['icon', 'id'])

const improveTable = new Map(
  improveData.map( d => [d.id, d])
)

const getJSTDayofWeek = () => {
  const date = new Date()
  let day = date.getUTCDay()
  if (date.getUTCHours() >= 15) {
    day = (day + 1) % 7
  }
  return day
}

export {
  improveData,
  improveTable,

  getJSTDayofWeek,
}
