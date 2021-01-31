import * as currency from './currency'

type Actor5e = game.dnd5e.entities.Actor5e

/**
 * Attempt to purchase an item from a merchant for a given player
 */
async function purchase(player: Actor5e, merchant: Actor5e, item: DropActorSheetDataActorItemPayload) {
  if (currency.isMoreThan(currency.fromActor(player), currency.fromPayload(item))) {
    // remove item from merchant
    await merchant.deleteOwnedItem(item.data._id, {})
    // TODO: remove currency from player
    // add item to player
    await player.createOwnedItem(item.data, {})
  }
}

export { purchase }
