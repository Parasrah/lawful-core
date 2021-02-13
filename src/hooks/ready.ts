import { PurchaseAction, SellAction } from '../actions'
import * as settings from '../settings'
import * as merchant from '../logic/merchant'
import createChannel from '../util/createChannel'

function onReady() {
  settings.init()

  const loot = {
    purchase: createChannel<'purchase', PurchaseAction>(
      'purchase',
      merchant.purchase,
    ),
    sell: createChannel<'sell', SellAction>('sell', merchant.sell),
  }
  if (!game.lawful) {
    game.lawful = { loot }
  } else {
    game.lawful.loot = loot
  }
}

export default onReady
