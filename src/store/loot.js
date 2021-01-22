import { createSlice } from '@reduxjs/toolkit'
import * as select from '../selectors'

const createLootSlice = (game) =>
  createSlice({
    name: 'loot',
    initialState: {
      containers: [],
      players: select.players(game.data.users),
    },
    reducers: {
      addItem(state, item) {
        return {
          ...state,
          containers: [...state.containers, item],
        }
      },
      setPlayers(state, players) {
        return { ...state, players }
      },
    },
  })

export default createLootSlice
