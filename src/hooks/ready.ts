import { MultiTransactionAction, PurchaseAction, SellAction } from '../actions'
import * as settings from '../settings'
import * as merchant from '../logic/merchant'
import createChannel from '../util/createChannel'
import { LogMessage } from '../models/messages'

function onReady() {
  settings.init()

  const loot = {
    purchase: createChannel<'purchase', PurchaseAction, LogMessage>(
      'purchase',
      merchant.purchase,
    ),
    sell: createChannel<'sell', SellAction, LogMessage>('sell', merchant.sell),
    promptForItemCount: createChannel<
      'multi-transaction',
      MultiTransactionAction,
      number
    >('multi-transaction', merchant.promptForItemCount),
  }
  if (!game.lawful) {
    game.lawful = { loot }
  } else {
    game.lawful.loot = loot
  }
}

export default onReady
