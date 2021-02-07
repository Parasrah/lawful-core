import { MODULE, SETTINGS } from './constants'

function init() {
  game.settings.register(MODULE, SETTINGS.PRIMARY_DM, {
    name: 'Primary DM',
    hint:
      'The primary dungeon master that must be online to sell/purchase goods',
    scope: 'world',
    config: true,
    type: String,
    choices: game.users
      .filter((x) => x.isGM)
      .reduce((acc, gm) => ({ ...acc, [gm.id]: gm.name }), {}),
    default: game.users.find((x) => x.isGM)!.id,
  })
}

const getPrimaryDm = () => game.settings.get(MODULE, SETTINGS.PRIMARY_DM)

export { init, getPrimaryDm }
