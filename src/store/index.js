import { configureStore } from '@reduxjs/toolkit'

import createLootSlice from './loot'

function createCore(game) {
  const lootSlice = createLootSlice(game)

  const store = configureStore({
    reducer: lootSlice.reducer,
  })

  function subscribe(fn) {
    let lastState = store.getState()
    store.subscribe(() => {
      const newState = store.getState()
      setTimeout(() => fn(newState, lastState), 0)
      lastState = newState
    })
  }

  return {
    subscribe,
    dispatch: store.dispatch.bind(store),
    loot: lootSlice.actions,
    // TODO: remove
    getState: () => store.getState(),
  }
}

export default createCore
