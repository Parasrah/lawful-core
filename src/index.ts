import './style/main.less'

import LawfulLootContainer from './sheets/container'
import LawfulLootMerchant from './sheets/merchant'
import notify from './util/notify'
import { isActorItem } from './util/typeguards'
import { SYSTEM } from './constants'
import * as settings from './settings'
import * as merchant from './logic/merchant'
import createChannel from './util/createChannel'
import { PurchaseAction, SellAction } from './actions'

/* ------------ Hooks ------------ */

Hooks.on('dropActorSheetData', (_, targetSheet, payload) => {
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
  // TODO: target could still be loot sheet

  return true
})

Hooks.on('ready', () => {
  settings.init()

  const loot = {
    purchase: createChannel<'purchase', PurchaseAction>('purchase', merchant.purchase),
    sell: createChannel<'sell', SellAction>('sell', merchant.sell),
  }
  if (!game.lawful) {
    game.lawful = { loot }
  } else {
    game.lawful.loot = loot
  }
})

/* ---------- Sheet Registration ---------- */

Actors.registerSheet(SYSTEM, LawfulLootContainer, {
  types: ['npc'],
  makeDefault: false,
})

Actors.registerSheet(SYSTEM, LawfulLootMerchant, {
  types: ['npc'],
  makeDefault: false,
})
