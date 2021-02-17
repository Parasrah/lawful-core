import {
  MultiTransactionAction,
  PurchaseAction,
  SellAction,
  SubAction,
} from '../actions'
import MultiTransaction from '../apps/multiTransaction'
import getParticipants from '../util/getParticipants'
import notify from '../util/notify'
import * as currency from './currency'
import * as trade from './trade'
import * as items from './items'

/**
 * Attempt to purchase an item from a merchant for a given player
 */
async function purchase(
  action: SubAction<PurchaseAction>,
): Promise<LogMessage> {
  const { player, lootActor: merchant, item } = getParticipants({
    direction: 'to-player',
    itemId: action.itemId,
    playerId: action.playerId,
    lootActorId: action.merchantId,
  })
  if (!merchant.data.token.actorLink) {
    notify.error(`remember to link actor data for merchant "${merchant.name}"`)
    return {
      type: 'error',
      msg: 'purchase failed, please consult your DM',
    }
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
    return {
      type: 'info',
      msg: `purchased ${item.name} from ${
        merchant.name
      } for ${currency.toString(itemPrice)}`,
    }
  } else {
    notify.info(
      `${player.name} attempted to purchase ${item.name} from ${merchant.name} but didn't have enough currency`,
    )
    return {
      type: 'error',
      msg: "you don't have enough currency to make this purchase",
    }
  }
}

async function sell(action: SubAction<SellAction>): Promise<LogMessage> {
  const { player, lootActor: merchant, item } = getParticipants({
    direction: 'from-player',
    itemId: action.itemId,
    playerId: action.playerId,
    lootActorId: action.merchantId,
  })
  const merchantCurrency = currency.fromActor(merchant)
  if (items.canStack(item) && item.data.data.quantity > 1) {
    // multi-sale
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
      return {
        type: 'info',
        msg: `you tried to sell ${count} of ${item.name} but you only have ${item.data.data.quantity}`,
      }
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
      return {
        type: 'info',
        msg: `sold ${count} of ${item.name} to ${merchant.name}`,
      }
    } else {
      notify.info(
        `${player.name} attempted to sell ${count} of ${item.name} but ${merchant.name} didn't have enough currency`,
      )
      return {
        type: 'error',
        msg: `you tried to sell ${count} of ${item} for ${currency.toString(
          itemPrice,
        )} but ${merchant.name} doesn't have enough`,
      }
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

      return {
        type: 'info',
        msg: `sold ${item.name} to ${merchant.name} for ${currency.toString(
          itemPrice,
        )}`,
      }
    } else {
      notify.info(
        `${player.name} attempted to sell ${item.name} but ${merchant.name} didn't have enough currency`,
      )
      return {
        type: 'error',
        msg: `attempted to sell ${item.name} for ${currency.toString(
          itemPrice,
        )} but ${merchant.name} doesn't have enough currency`,
      }
    }
  }
}

function promptForItemCount(opts: SubAction<MultiTransactionAction>) {
  const fnName = (() => {
    switch (opts.direction) {
      case 'from-player':
        return 'sell'
      case 'to-player':
        return 'purchase'
    }
  })()
  return MultiTransaction[fnName]({
    ...opts,
  })
}

export { purchase, sell, promptForItemCount }
