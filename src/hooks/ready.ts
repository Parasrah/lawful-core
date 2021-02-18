import * as settings from '../settings'
import * as merchant from '../logic/merchant'
import {
  createMasterChannel,
  createTargetedChannel,
} from '../util/createChannel'

function onReady() {
  settings.init()

  const loot = {
    purchase: createMasterChannel<'purchase', PurchaseAction, LogMessage>(
      'purchase',
      merchant.purchase,
    ),
    sell: createMasterChannel<'sell', SellAction, LogMessage>(
      'sell',
      merchant.sell,
    ),
    promptForItemCount: createTargetedChannel<
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
