import notify from '../util/notify'
import * as items from './items'
import * as currencyLogic from './currency'

type Actor5e = game.dnd5e.entities.Actor5e
type Item5e = game.dnd5e.entities.Item5e

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

async function addItem(actor: Actor5e, item: Item5e, count: number = 1) {
  const ownedItem = actor.items.find((i) => items.compare(i, item))
  if (ownedItem) {
    ownedItem.update({
      data: { quantity: ownedItem.data.data.quantity + count },
    })
  } else {
    const data = item.toJSON()
    data.data.quantity = count
    await actor.createEmbeddedDocuments('Item', [data])
  }
}

interface TradeItemOpts {
  from: Actor5e
  to: Actor5e
  item: Item5e
  count?: number
}

async function item({ from, to, item, count = 1 }: TradeItemOpts) {
  await removeItem(from, item, count)
  await addItem(to, item, count)
}

interface TradeCurrencyOpts {
  from: Actor5e
  to: Actor5e
  amount: Currency
}

async function currency({ from, to, amount }: TradeCurrencyOpts) {
  const fromCurrency = from.data.data.currency
  const toCurrency = to.data.data.currency
  const { from: freshFromCurrency, to: freshToCurrency } = currencyLogic.transfer({
    amount,
    from: fromCurrency,
    to: toCurrency,
  })
  await currencyLogic.updateActor(from, freshFromCurrency)
  await currencyLogic.updateActor(to, freshToCurrency)
}

export { item, currency }
