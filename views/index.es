import React from 'react'
import ReactDOM from 'react-dom'
import { Grid } from 'react-bootstrap'
import { Provider } from 'react-redux'
import { store } from 'views/create-store'

import { ItemInfoArea } from './item-info-area'
// import { StarcraftArea } from './starcraft/starcraft-area'

const { $ } = window

window.store = store

const Main = () => (
  <Grid className="flex-column full-height">
    <div className="flex-column flex-1">
      <ItemInfoArea />
    </div>
  </Grid>
)

ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  $('#item-improvement'))
