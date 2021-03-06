import './style/main.less'

import LawfulLootContainer from './sheets/container'
import LawfulLootMerchant from './sheets/merchant'
import { SYSTEM } from './constants'
import onDropActorSheetData from './hooks/dropActorSheetData'
import onReady from './hooks/ready'
import onInit from './hooks/init'

/* ------------ Hooks ------------ */

Hooks.on('dropActorSheetData', onDropActorSheetData)

Hooks.on('ready', onReady)

Hooks.on('init', onInit)

/* ---------- Sheet Registration ---------- */

Actors.registerSheet(SYSTEM, LawfulLootContainer, {
  types: ['npc'],
  makeDefault: false,
})

Actors.registerSheet(SYSTEM, LawfulLootMerchant, {
  types: ['npc'],
  makeDefault: false,
})
