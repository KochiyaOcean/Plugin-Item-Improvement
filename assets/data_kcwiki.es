// This script downloads and converts item impovement data from Kcwiki data repo
// use babel-node or node>=7
const _ = require('lodash')
const path = require('path')
const fs = require('fs-extra')
const fetch = require('node-fetch')
const HttpsProxyAgent = require('https-proxy-agent')

const proxy = process.env.https_proxy || process.env.http_proxy || ''

const DATA_PATH = 'http://kcwikizh.github.io/kcdata/slotitem/poi_improve.json'
const START2_PATH = 'http://api.kcwiki.moe/start2'

const get = async url => {
  const resp = await fetch(url, {
    agent: proxy ? new HttpsProxyAgent(proxy) : null,
  })
  return resp.json()
}

const processData = (data, $ships) => {
  const ourShips = _.pickBy($ships, ({ api_sortno }) => Boolean(api_sortno))
  const beforeShipMap = _(ourShips)
    .filter(ship => +(ship.api_aftershipid || 0) > 0)
    .map(ship => ([ship.api_aftershipid, ship.api_id]))
    .fromPairs()
    .value()

  const chains = _(ourShips)
    .mapValues(({ api_id: shipId }) => {
      let current = $ships[shipId]
      let next = +(current.api_aftershipid || 0)
      let same = [shipId]
      while (!same.includes(next) && next > 0) {
        same = [...same, next]
        current = $ships[next] || {}
        next = +(current.api_aftershipid || 0)
      }
      return same
    })
    .value()

  const uniqIds = _(ourShips)
    .filter(({ api_id }) => !(api_id in beforeShipMap))
    .map(({ api_id }) => api_id)
    .value()

  const uniqMap = _(uniqIds)
    .flatMap(shipId =>
      _(chains[shipId]).map(id => ([id, shipId])).value()
    )
    .fromPairs()
    .value()

  const remodelChains = _(uniqMap)
    .mapValues(uniqueId => chains[uniqueId])
    .value()

  return _.map(data, item => ({
    ...item,
    improvement: _.map(item.improvement, imp => ({
      ...imp,
      req: _.map(imp.req, r => {
        if (r.secretaryIds.length === 1) {
          return r
        }

        const uniq = _.uniq(r.secretaryIds.map(id => uniqMap[id]))
        if (uniq.length === r.secretaryIds.length) {
          return r
        }

        const secretaryIds = []
        const secretary = []
        uniq.forEach(id => {
          const variants = r.secretaryIds.filter(i => remodelChains[id].includes(i))
          const first = _.minBy(variants, i => remodelChains[id].indexOf(i))
          secretaryIds.push(first)
          secretary.push(_.get($ships, [first, 'api_name']))
        })

        return ({
          ...r,
          secretary,
          secretaryIds,
        })
      }),
    })
    ),
  }))
}

const main = async () => {
  try {
    const data = await get(DATA_PATH)
    const start2 = await get(START2_PATH)
    const $ships = _.keyBy(start2.api_mst_ship, 'api_id')
    const sdata = _.sortBy(processData(data, $ships), ['icon', 'id'])
    await fs.outputJSON(path.resolve(__dirname, './data.json'), sdata, { spaces: 2 })
  } catch (e) {
    console.error(e)
  }
}

main()
