import { PurchaseAction, SellAction } from '../actions'
import notify from '../util/notify'
import * as currency from './currency'

type Actor5e = game.dnd5e.entities.Actor5e

/**
 * Attempt to purchase an item from a merchant for a given player
 */
async function purchase(action: Omit<PurchaseAction, 'type'>): Promise<boolean> {
  const player = game.actors.get(action.playerId)
  const merchant = game.actors.get(action.merchantId)
  const item = merchant?.items?.get(action.itemId)
  if (!player || !merchant || !item) {
    notify.error('failed to find entity for purchase')
    return false
  }
  if (
    currency.isMoreThan(currency.fromActor(player), currency.fromItem(item))
  ) {
    // remove item from merchant
    await merchant.deleteOwnedItem(item.data._id, {})
    // TODO: remove currency from player
    // add item to player
    await player.createOwnedItem(item.data, {})
  }

  return true
}

async function sell(action: Omit<SellAction, 'type'>): Promise<boolean> {
  return false
}

export { purchase, sell }
