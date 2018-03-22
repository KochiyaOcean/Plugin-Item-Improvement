import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  wctfSelector,
  constSelector,
  configSelector,
  equipsSelector,
  createDeepCompareArraySelector,
} from 'views/utils/selectors'

const ourShipsSelector = createSelector(
  [
    constSelector,
  ], ({ $ships = {} } = {}) => _($ships)
    .pickBy(({ api_sortno }) => Boolean(api_sortno))
    .value()
)

// the chain starts from each ship, thus incomplete if the ship is not the starting one
// the adjustedRemodelChainsSelector will return complete chains for all ships
const remodelChainsSelector = createSelector(
  [
    ourShipsSelector,
  ], $ships => _($ships)
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
)

const beforeShipMapSelector = createSelector(
  [
    ourShipsSelector,
  ], $ships => _($ships)
    .filter(ship => +(ship.api_aftershipid || 0) > 0)
    .map(ship => ([ship.api_aftershipid, ship.api_id]))
    .fromPairs()
    .value()
)

export const uniqueShipIdsSelector = createSelector(
  [
    ourShipsSelector,
    beforeShipMapSelector,
  ], ($ships, beforeShipMap) => _($ships)
    .filter(({ api_id }) => !(api_id in beforeShipMap)) // eslint-disable-line camelcase
    .map(({ api_id }) => api_id) // eslint-disable-line camelcase
    .value()
)

export const shipUniqueMapSelector = createSelector(
  [
    uniqueShipIdsSelector,
    remodelChainsSelector,
  ], (shipIds, chains) => _(shipIds)
    .flatMap(shipId =>
      _(chains[shipId]).map(id => ([id, shipId])).value()
    )
    .fromPairs()
    .value()
)

export const adjustedRemodelChainsSelector = createSelector(
  [
    remodelChainsSelector,
    shipUniqueMapSelector,
  ], (remodelChains, uniqueMap) => _(uniqueMap)
    .mapValues(uniqueId => remodelChains[uniqueId])
    .value()
)

export const starCraftPlanSelector = createSelector(
  [
    configSelector,
  ], config => _.get(config, 'plugin.poi-plugin-starcraft.plans', {})
)

export const equipLevelStatSelector = createSelector(
  [
    equipsSelector,
  ], equips => _(equips)
    .groupBy('api_slotitem_id')
    .mapValues(items => _(items).map(item => item.api_level || 0).value())
    .value()
)

// base data is dependent on wctf-db and const
const baseImprovementDataSelector = createSelector(
  [
    wctfSelector,
    constSelector,
    adjustedRemodelChainsSelector,
    shipUniqueMapSelector,
  ], (db, $const, chains, uniqMap) => _(_.get(db, 'arsenal_all'))
    .keys()
    .map(itemId => {
      const item = _.get(db, ['items', itemId], {})
      const assistants = _(_.range(7).concat(-1))
        .map(day =>
          ([
            day,
            _(item.improvement)
              .flatMap(entry =>
                _(entry.req)
                  .flatMap(([days, ships]) => (day === -1 || days[day]) ? ships : [])
                  .groupBy(id => uniqMap[id])
                  .mapValues(ids => _(ids)
                    .sortBy(id => (chains[id] || []).indexOf(id))
                    .take(1)
                    .value()
                  )
                  .values()
                  .flatten()
                  .map(id => window.i18n['poi-plugin-item-improvement'].__(window.i18n.resources.__(_.get($const, ['$ships', id, 'api_name'], 'None'))))
                  .value()
              )
              .join('/'),
          ])
        )
        .fromPairs()
        .value()

      return {
        ..._.get($const, ['$equips', item.id], {}),
        ...item,
        priority: 0,
        assistants,
      }
    })
    .value()
)

export const improvementDataSelector = createSelector(
  [
    baseImprovementDataSelector,
    starCraftPlanSelector,
    equipLevelStatSelector,
  ], (data, plans, levels) => _(data).map(item => {
    const { id } = item
    if (!plans[id] || _.keys(plans[id]).length === 0) {
      return item
    }
    const isNotFull = _(plans[id])
      .entries()
      .some(([star, count]) =>
        count > _(levels[id]).countBy(lv => lv >= parseInt(star, 10))
      )
    return {
      ...item,
      priority: isNotFull ? 2 : 1,
    }
  })
  .value()
)

export const improveItemIdsByDaySelector = createSelector(
  [
    wctfSelector,
  ], db => _(_.get(db, 'arsenal_weekday'))
    .mapValues(day =>
      _(day.improvements)
        .map(([id]) => id)
        .value()
    )
    .value()
)

const arrayResultWrapper = selector =>
  createDeepCompareArraySelector(selector, result => result)

export const itemLevelStatFactory = _.memoize(id =>
  arrayResultWrapper(createSelector(
    [
      equipLevelStatSelector,
    ], equipLevels => equipLevels[id] || []
  )
))

export const $shipsSelector = createSelector(
  [
    constSelector,
  ], $const => _.get($const, '$ships', {})
)
