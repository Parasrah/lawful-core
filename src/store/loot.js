import { createSlice } from '@reduxjs/toolkit'
import { v4 } from 'uuid'

function createContainer(item) {
  return {
    id: v4(),
    items: [item],
  }
}

function addItemToContainer(container, item) {
  return {
    ...container,
    items: [...container.items, item],
  }
}

const createLootSlice = () =>
  createSlice({
    name: 'loot',
    initialState: {
      containers: [],
      players: [],
    },
    reducers: {
      addItem(state, item) {
        const { containers } = state
        if (state.containers.length) {
          const [head, ...rest] = containers
          return {
            ...state,
            containers: [addItemToContainer(head, item), ...rest],
          }
        } else {
          return {
            ...state,
            containers: [createContainer(item)],
          }
        }
      },
      setPlayers(state, players) {
        return { ...state, players }
      },
    },
  })

export default createLootSlice
