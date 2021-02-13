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
  const merchantCurrency = currency.fromActor(merchant)
  const playerCurrency = currency.fromActor(player)
  const itemPrice = currency.fromItem(item)
  if (currency.isMoreThanOrEqualTo(playerCurrency, itemPrice)) {
    const newItem = await item.clone()
    const {
      from: newPlayerCurrency,
      to: newMerchantCurrency,
    } = currency.transfer({
      amount: itemPrice,
      from: playerCurrency,
      to: merchantCurrency,
    })
    await currency.updateActor(merchant, newMerchantCurrency)
    await currency.updateActor(player, newPlayerCurrency)
    await merchant.deleteOwnedItem(item.data._id, {})
    await player.createOwnedItem(newItem.data, {})

    notify.info(
      `${player.name} purchased ${item.name} from ${
        merchant.name
      } for ${currency.toString(itemPrice)}`,
    )
  } else {
    notify.info(
      `${player.name} attempted to purchase ${item.name} from ${merchant.name} but didn't have enough currency`,
    )
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
  const merchantCurrency = currency.fromActor(merchant)
  const playerCurrency = currency.fromActor(player)
  const itemPrice = currency.fromItem(item)
  if (currency.isMoreThanOrEqualTo(merchantCurrency, itemPrice)) {
    const newItem = await item.clone()
    const {
      from: newMerchantCurrency,
      to: newPlayerCurrency,
    } = currency.transfer({
      amount: itemPrice,
      from: merchantCurrency,
      to: playerCurrency,
    })
    await currency.updateActor(merchant, newMerchantCurrency)
    await currency.updateActor(player, newPlayerCurrency)
    await player.deleteOwnedItem(item.data._id, {})
    await merchant.createOwnedItem(newItem.data, {})

    notify.info(
      `${player.name} sold ${item.name} to ${
        merchant.name
      } for ${currency.toString(itemPrice)}`,
    )

    return true
  } else {
    notify.info(
      `${player.name} attempted to sell ${item.name} but ${merchant.name} didn't have enough currency`,
    )
  }
  return false
}

export { purchase, sell }
