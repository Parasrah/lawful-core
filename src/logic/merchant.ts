import { PurchaseAction, SellAction } from '../actions'
import MultiTransaction from '../apps/multiTransaction'
import notify from '../util/notify'
import * as currency from './currency'
import * as items from './items'

type Actor5e = game.dnd5e.entities.Actor5e
type Item5e = game.dnd5e.entities.Item5e

async function transferCurrency(
  fromActor: Actor5e,
  toActor: Actor5e,
  amount: Currency,
) {
  const from = fromActor.data.data.currency
  const to = toActor.data.data.currency
  const { from: freshFrom, to: freshTo } = currency.transfer({
    amount,
    from,
    to,
  })
  await currency.updateActor(fromActor, freshFrom)
  await currency.updateActor(toActor, freshTo)
}

async function addItem(actor: Actor5e, item: Item5e, count: number = 1) {
  const ownedItem = actor.items.find((i) => items.compare(i, item))
  if (ownedItem) {
    ownedItem.update({
      data: { quantity: ownedItem.data.data.quantity + count },
    })
  } else {
    const clone = await item.clone()
    await actor.createOwnedItem(clone.data)
  }
}

async function removeItem(actor: Actor5e, item: Item5e, count: number = 1) {
  const ownedItem = actor.items.get(item.id)
  if (!ownedItem) {
    throw notify.error(`failed to find ${item.name} in ${actor.name} to remove`)
  }
  const ownedCount = ownedItem.data.data.quantity
  if (ownedCount === count) {
    await actor.deleteOwnedItem(item.id)
  } else if (ownedCount > count) {
    await ownedItem.update({
      data: {
        quantity: ownedCount - count,
      },
    })
  } else {
    throw notify.error(
      `attempted to remove ${count} of ${item.name} from ${actor.name} despite them only having ${ownedItem.data.data.quantity}`,
    )
  }
}

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
  const playerCurrency = currency.fromActor(player)
  const itemPrice = currency.fromItem(item)
  if (currency.isMoreThanOrEqualTo(playerCurrency, itemPrice)) {
    await transferCurrency(player, merchant, itemPrice)
    await removeItem(merchant, item)
    await addItem(player, item)

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
  if (item.data.data.quantity > 1) {
    // multi-sale
    try {
      const count = await MultiTransaction.sell({
        playerId: player.id,
        merchantId: merchant.id,
        itemId: item.id,
      })
      if (count > item.data.data.quantity) {
        notify.info(
          `${player.name} attempted to sell ${count} of ${item.name} but only has ${item.data.data.quantity}`,
        )
        return false
      }
      const itemPrice = currency.multiply(count, currency.fromItem(item))
      if (currency.isMoreThanOrEqualTo(merchantCurrency, itemPrice)) {
        // update currency
        await transferCurrency(merchant, player, itemPrice)

        // remove from actor
        await removeItem(player, item, count)

        // add to actor
        await addItem(merchant, item, count)

        notify.info(
          `${player.name} sold ${count} of ${item.name} to ${
            merchant.name
          } for ${currency.toString(itemPrice)}`,
        )
      } else {
        notify.info(
          `${player.name} attempted to sell ${count} of ${item.name} but ${merchant.name} didn't have enough currency`,
        )
      }
    } catch (msg) {
      notify.info(msg)
    }
  } else {
    const itemPrice = currency.fromItem(item)
    if (currency.isMoreThanOrEqualTo(merchantCurrency, itemPrice)) {
      // single-sale
      const newItem = await item.clone()
      await transferCurrency(merchant, player, itemPrice)
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
  }
  return false
}

export { purchase, sell }
