import createCore from './store'
import * as select from './selectors'

Hooks.once('setup', () => {
  game.lawful = createCore(game)
})

Hooks.once('ready', () => {})

Hooks.on('renderPlayerList', (_, __, { users }) => {
  const { lawful } = game
  lawful.dispatch(lawful.loot.setPlayers(select.players(game.users)))
})
