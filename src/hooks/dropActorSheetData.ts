import LawfulLootContainer from '../sheets/container'
import LawfulLootMerchant from '../sheets/merchant'
import notify from '../util/notify'
import { isActorItem } from '../util/typeguards'
import * as settings from '../settings'

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
    if (itemOwner.id === targetSheet.actor.id) {
      return true
    }
    const { sheet: ownerSheet } = itemOwner

    // check if target is lawful actor (selling)
    if (targetSheet instanceof LawfulLootContainer) {
      notify.error('loot container not implemented')
      return false
    }
    if (targetSheet instanceof LawfulLootMerchant) {
      game.lawful.loot
        .sell({
          merchantId: targetSheet.actor.id,
          playerId: itemOwner.id,
          itemId: payload.data._id,
        })
        .then(({ type, msg }) => {
          if (settings.getPrimaryDm() !== game.user.id) {
            notify[type](msg)
          }
        })
    }

    if (ownerSheet instanceof LawfulLootContainer) {
      notify.error('loot container not implemented')
      return false
    }
    if (ownerSheet instanceof LawfulLootMerchant) {
      game.lawful.loot
        .purchase({
          playerId: targetSheet.actor.id,
          merchantId: itemOwner.id,
          itemId: payload.data._id,
        })
        .then(({ type, msg }) => {
          if (settings.getPrimaryDm() !== game.user.id) {
            notify[type](msg)
          }
        })
      return false
    }
  }

  return true
}

export default onDropActorSheetData
