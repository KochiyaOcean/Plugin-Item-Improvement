import _ from 'lodash'
import { createSelector } from 'reselect'
import {
  wctfSelector,
  constSelector,
  configSelector,
  equipsSelector,
  createDeepCompareArraySelector,
} from 'views/utils/selectors'

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
  ], (db, $const) => _(_.get(db, 'arsenal_all'))
    .keys()
    .map(id => _.get(db, ['items', id], {}))
    .map(item => {
      const assistants = _(_.range(7).concat(-1))
        .map(day =>
          ([
            day,
            _(item.improvement)
              .flatMap(entry =>
                _(entry.req)
                  .flatMap(([days, ships]) => (day === -1 || days[day]) ? ships : [])
                  .map(id => window.__(window.i18n.resources.__(_.get($const, ['$ships', id, 'api_name'], 'None'))))
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
    if (!plans[id]) {
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
