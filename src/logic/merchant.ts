import { PurchaseAction, SellAction } from '../actions'
import notify from '../util/notify'
import * as currency from './currency'

/**
 * Attempt to purchase an item from a merchant for a given player
 */
async function purchase(
  action: Omit<PurchaseAction, 'type'>,
): Promise<boolean> {
  const player = game.actors.get(action.playerId)
  const merchant = game.actors.get(action.merchantId)
  const item = merchant?.items?.get(action.itemId)
  if (!player || !merchant || !item) {
    notify.error('failed to find entity for purchase')
    return false
  }
  if (!merchant.data.token.actorLink) {
    notify.error(`remember to link actor data for merchant "${merchant.name}"`)
    return false
  }
  if (
    currency.isMoreThan(currency.fromActor(player), currency.fromItem(item))
  ) {
    const newItem = await item.clone()
    await merchant.deleteOwnedItem(item.data._id, {})
    await player.createOwnedItem(newItem.data, {})

    notify.info(`${player.name} purchased ${item.name} from ${merchant.name}`)
  } else {
    notify.info(`${player.name} attempted to purchase ${item.name} from ${merchant.name} but didn't have enough currency`)
  }

  return true
}

async function sell(action: Omit<SellAction, 'type'>): Promise<boolean> {
  const player = game.actors.get(action.playerId)
  const merchant = game.actors.get(action.merchantId)
  const item = player?.items?.get(action.itemId)
  if (!player || !merchant || !item) {
    notify.error('failed to find entity for sale')
    return false
  }
  if (!merchant.data.token.actorLink) {
    notify.error(`remember to link actor data for merchant "${merchant.name}"`)
    return false
  }
  if (
    currency.isMoreThan(currency.fromActor(merchant), currency.fromItem(item))
  ) {
    const newItem = await item.clone()
    await player.deleteOwnedItem(item.data._id, {})
    await merchant.createOwnedItem(newItem.data, {})

    notify.info(`${player.name} sold ${item.name} to ${merchant.name}`)

    return true
  } else {
    notify.info(`${player.name} attempted to sell ${item.name} but ${merchant.name} didn't have enough currency`)
  }
  return false
}

export { purchase, sell }
