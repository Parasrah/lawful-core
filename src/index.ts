import './style/main.less'

import LawfulLootContainer from './sheets/container'
import LawfulLootMerchant from './sheets/merchant'
import notify from './util/notify'
import { isActorItem, isCompendiumItem } from './util/typeguards'
import { system } from './constants'
import { purchase } from './logic/merchant'

/* ------------ Hooks ------------ */

Hooks.on('dropActorSheetData', (_, targetSheet, payload) => {
  if (game.user.isGM) {
    // for now, bypass everything for GM to allow easy setup of loot sheets
    return true
  }

  // check if target is lawful actor (selling)
  if (targetSheet instanceof LawfulLootContainer) {
    return false
  }
  if (targetSheet instanceof LawfulLootMerchant) {
    return false
  }

  // see if source is lawful actor (buying)
  if (isActorItem(payload)) {
    const actor = game.actors.get(payload.actorId)
    if (!actor) {
      notify.error(
        'failed to find the actor, please raise an issue for Lawful Loot',
      )
      return true
    }
    const { sheet } = actor
    if (sheet instanceof LawfulLootContainer) {
      return false
    }
    if (sheet instanceof LawfulLootMerchant) {
      purchase(targetSheet.actor, actor, payload)
      return false
    }
  }
  // TODO: target could still be loot sheet

  return true
})

/* ---------- Sheet Registration ---------- */

Actors.registerSheet(system, LawfulLootContainer, {
  types: ['npc'],
  makeDefault: false,
})

Actors.registerSheet(system, LawfulLootMerchant, {
  types: ['npc'],
  makeDefault: false,
})
