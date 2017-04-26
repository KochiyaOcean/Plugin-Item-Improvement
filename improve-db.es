import fs from 'fs-extra'
import path from 'path-extra'
import _ from 'lodash'

const dataRaw = fs.readJsonSync(path.join(__dirname, 'assets', 'data.json'))
const improveData = _.sortBy(dataRaw, ['icon', 'id'])

const improveTable = new Map(
  improveData.map( d => [d.id, d])
)

export { improveData, improveTable }
