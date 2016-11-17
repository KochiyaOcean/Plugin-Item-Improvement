// This script downloads and converts item impovement data from Kcwiki data repo
// use babel-node or node>=7
const _ = require('lodash')
const fs = require('fs-extra')
const request = require('request-promise-native')

const KCWIKI_DATA = "http://kcwikizh.github.io/kcdata/slotitem/poi_improve.json"

request(KCWIKI_DATA)
  .then( (data) => {
    const sdata = _.sortBy(JSON.parse(data), ['icon', 'id'])
    fs.outputJson('./data.json', sdata, (err) => { if (err) console.log(err) } )
  })
  .catch(err => console.log(err))