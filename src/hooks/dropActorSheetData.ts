import LawfulLootContainer from '../sheets/container'
import LawfulLootMerchant from '../sheets/merchant'
import notify from '../util/notify'
import { isActorItem } from '../util/typeguards'

type Actor5e = game.dnd5e.entities.Actor5e
type Sheet = ActorSheet<ActorSheetOptions, ActorSheetData, Actor5e>

function onDropActorSheetData(
  _: Actor5e,
  targetSheet: Sheet,
  payload: DropActorSheetDataPayload,
) {
  if (game.user.isGM) {
    // for now, bypass everything for GM to allow easy setup of loot sheets
    return true
  }
  if (isActorItem(payload)) {
    const itemOwner = game.actors.get(payload.actorId)
    if (!itemOwner) {
      notify.error('failed to find item owner')
      return false
    }

    // check if target is lawful actor (selling)
    if (targetSheet instanceof LawfulLootContainer) {
      return false
    }
    if (targetSheet instanceof LawfulLootMerchant) {
      game?.lawful?.loot?.sell({
        merchantId: targetSheet.actor.id,
        playerId: itemOwner.id,
        itemId: payload.data._id,
      })
    }

    if (!itemOwner) {
      notify.error(
        'failed to find the actor, please raise an issue for Lawful Loot',
      )
      return true
    }
    const { sheet } = itemOwner
    if (sheet instanceof LawfulLootContainer) {
      return false
    }
    if (sheet instanceof LawfulLootMerchant) {
      game?.lawful?.loot?.purchase({
        playerId: targetSheet.actor.id,
        merchantId: itemOwner.id,
        itemId: payload.data._id,
      })
      return false
    }
  }

  return true
}

export default onDropActorSheetData
