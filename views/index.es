import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from 'views/create-store'

import { ItemInfoArea } from './item-info-area'
// import { StarcraftArea } from './starcraft/starcraft-area'

const { $ } = window

window.store = store

ReactDOM.render(
  <Provider store={store}>
    <ItemInfoArea />
  </Provider>,
  $('#item-improvement'))
