import { PurchaseAction, SellAction } from '../actions'
import MultiTransaction from '../apps/multiTransaction'
import getParticipants from '../util/getParticipants'
import notify from '../util/notify'
import * as currency from './currency'
import * as trade from './trade'

/**
 * Attempt to purchase an item from a merchant for a given player
 */
async function purchase(
  action: Omit<PurchaseAction, 'type'>,
): Promise<boolean> {
  const { player, lootActor: merchant, item } = getParticipants({
    direction: 'to-player',
    itemId: action.itemId,
    playerId: action.playerId,
    lootActorId: action.merchantId,
  })
  if (!merchant.data.token.actorLink) {
    notify.error(`remember to link actor data for merchant "${merchant.name}"`)
    return false
  }
  const playerCurrency = currency.fromActor(player)
  const itemPrice = currency.fromItem(item)
  if (currency.isMoreThanOrEqualTo(playerCurrency, itemPrice)) {
    await trade.currency({
      from: player,
      to: merchant,
      amount: itemPrice,
    })
    await trade.item({
      from: merchant,
      to: player,
      item,
    })

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
  const { player, lootActor: merchant, item } = getParticipants({
    direction: 'from-player',
    itemId: action.itemId,
    playerId: action.playerId,
    lootActorId: action.merchantId,
  })
  const merchantCurrency = currency.fromActor(merchant)
  if (item.data.data.quantity > 1) {
    // multi-sale
    try {
      const count = await game.lawful.loot.promptForItemCount({
        playerId: player.id,
        merchantId: merchant.id,
        itemId: item.id,
        direction: 'from-player',
      })
      if (count > item.data.data.quantity) {
        notify.info(
          `${player.name} attempted to sell ${count} of ${item.name} but only has ${item.data.data.quantity}`,
        )
        return false
      }
      const itemPrice = currency.multiply(count, currency.fromItem(item))
      if (currency.isMoreThanOrEqualTo(merchantCurrency, itemPrice)) {
        await trade.currency({
          from: merchant,
          to: player,
          amount: itemPrice,
        })
        await trade.item({
          from: player,
          to: merchant,
          item,
          count,
        })

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
      await trade.currency({
        from: merchant,
        to: player,
        amount: itemPrice,
      })
      await trade.item({
        from: player,
        to: merchant,
        item,
      })

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

async function promptForItemCount() {
  return 1
}

export { purchase, sell, promptForItemCount }
