// This script downloads and converts item impovement data from Kcwiki data repo
// use babel-node or node>=7
const _ = require('lodash')
const path = require('path')
const fs = require('fs-extra')
const fetch = require('node-fetch')
const HttpsProxyAgent = require('https-proxy-agent')

const proxy = process.env.https_proxy || process.env.http_proxy || ''

const DATA_PATH = 'http://kcwikizh.github.io/kcdata/slotitem/poi_improve.json'

const main = async () => {
  try {
    const resp = await fetch(DATA_PATH, {
      agent: proxy ? new HttpsProxyAgent(proxy) : null,
    })
    const data = await resp.json()
    const sdata = _.sortBy(data, ['icon', 'id'])
    await fs.outputJSON(path.resolve(__dirname, './data.json'), sdata, { spaces: 2 })
  } catch (e) {
    console.error(e)
  }
}

main()
