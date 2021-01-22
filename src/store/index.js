import { configureStore } from '@reduxjs/toolkit'

import createLootSlice from './loot'

function createCore(game) {
  const lootSlice = createLootSlice(game)

  const store = configureStore({
    reducer: lootSlice.reducer,
  })

  return {
    subscribe: store.subscribe.bind(store),
    dispatch: store.dispatch.bind(store),
    loot: lootSlice.actions,
  }
}

export default createCore
