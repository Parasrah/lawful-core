import './style/main.less'

import LawfulLootContainer from './sheets/container'
import LawfulLootMerchant from './sheets/merchant'
import notify from './util/notify'
import { isActorItem } from './util/typeguards'
import { system } from './constants'

/* ------------ Hooks ------------ */

Hooks.on('dropActorSheetData', (_, targetSheet, payload) => {
  // check if source is lawful actor
  if (targetSheet instanceof LawfulLootContainer) {
    return false
  }
  if (targetSheet instanceof LawfulLootMerchant) {
    return false
  }

  // see if target is lawful actor
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
      return false
    }
  }

  return true
})

/* ---------- Mutations ---------- */

Actors.registerSheet(system, LawfulLootContainer, {
  types: ['npc'],
  makeDefault: false,
})

Actors.registerSheet(system, LawfulLootMerchant, {
  types: ['npc'],
  makeDefault: false,
})
