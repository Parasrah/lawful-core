import notify from './notify'

type Direction = 'to-player' | 'from-player'

interface Opts {
  itemId: string
  playerId: string
  lootActorId: string
  direction: Direction
}

function getParticipants({ playerId, lootActorId, direction, itemId }: Opts) {
  const player = game.actors.get(playerId)
  const lootActor = game.actors.get(lootActorId)
  if (!player) {
    throw notify.error('failed to find player for transaction')
  }
  if (!lootActor) {
    throw notify.error('failed to find loot actor for transaction')
  }
  const item = (() => {
    switch (direction) {
      case 'from-player':
        return player.getOwnedItem(itemId)
      case 'to-player':
        return lootActor.getOwnedItem(itemId)
    }
  })()
  if (!item) {
    throw notify.error('failed to find item for transaction')
  }

  return {
    lootActor,
    player,
    item,
  }
}

export { Direction }
export default getParticipants
