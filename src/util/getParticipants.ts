import notify from './notify'

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
        return player.items.get(itemId)
      case 'to-player':
        return lootActor.items.get(itemId)
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

export default getParticipants
