import createCore from './store'
import * as select from './selectors'

Hooks.once('init', () => {})

Hooks.once('ready', () => {
  game.lawful = createCore()
})

Hooks.on('renderPlayerList', (_, __, { users }) => {
  const { lawful } = game
  lawful.dispatch(lawful.loot.setPlayers(select.players(users)))
})
