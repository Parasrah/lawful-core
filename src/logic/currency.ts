import { keys } from '../util/fn'
import notify from '../util/notify'

type Actor5e = game.dnd5e.entities.Actor5e

function create(currency: Partial<Currency> = {}): Currency {
  return {
    cp: 0,
    ep: 0,
    gp: 0,
    pp: 0,
    sp: 0,
    ...currency,
  }
}

function isMoreThan(
  left: Currency,
  right: Currency,
  normalized = false,
): boolean {
  if (!normalized) {
    return isMoreThan(normalize(left), normalize(right), true)
  }
  return moreThanBox(left, right)
    .check('pp')
    .check('gp')
    .check('ep')
    .check('sp')
    .check('cp')
    .unwrap()
}

const moreThanBox = (
  left: Currency,
  right: Currency,
  result: boolean | null = null,
) => ({
  check(key: keyof Currency) {
    if (result !== null) {
      // forward result if we already have one
      return moreThanBox(left, right, result)
    }
    const l = left[key]
    const r = right[key]
    if (l > r) {
      return moreThanBox(left, right, true)
    }
    if (l < r) {
      return moreThanBox(left, right, false)
    }
    return moreThanBox(left, right)
  },
  unwrap() {
    // if the result is null, all are equal and it is not more than
    if (result === null) {
      return false
    }
    return result
  },
})

function isEqualTo(
  left: Currency,
  right: Currency,
  normalized = false,
): boolean {
  if (!normalized) {
    return isEqualTo(normalize(left), normalize(right), true)
  }
  return (
    left.pp === right.pp &&
    left.gp === right.gp &&
    left.ep === right.ep &&
    left.sp === right.sp &&
    left.cp === right.cp
  )
}

function isLessThan(
  left: Currency,
  right: Currency,
  normalized = false,
): boolean {
  return !isMoreThanOrEqualTo(left, right, normalized)
}

function isMoreThanOrEqualTo(
  left: Currency,
  right: Currency,
  normalized = false,
): boolean {
  if (!normalized) {
    return isMoreThanOrEqualTo(normalize(left), normalize(right), true)
  }
  return isEqualTo(left, right, true) || isMoreThan(left, right, true)
}

function isLessThanOrEqualTo(
  left: Currency,
  right: Currency,
  normalized = false,
): boolean {
  if (!normalized) {
    return isLessThanOrEqualTo(normalize(left), normalize(right), true)
  }
  return isEqualTo(left, right) || isLessThan(left, right)
}

/**
 * Convert all denominations into its highest
 * possible value
 */
function normalize(c: Currency): Currency {
  // 10 copper -> silver
  const [cp, newSilver] = convert(c.cp, 10)

  // 5 silver -> electrum
  const [sp, newElectrum] = convert(c.sp + newSilver, 5)

  // 2 electrun -> gold
  const [ep, newGold] = convert(c.ep + newElectrum, 2)

  // 10 gold -> platinum
  const [gp, newPlatinum] = convert(c.gp + newGold, 10)

  const pp = c.pp + newPlatinum

  return {
    cp,
    sp,
    ep,
    gp,
    pp,
  }
}

function convert(source: number, ratio: number): Tuple2<number, number> {
  const remainder = source % ratio
  const converted = Math.floor(source / ratio)
  return [remainder, converted]
}

function fromActor(actor: game.dnd5e.entities.Actor5e): Currency {
  return actor.data.data.currency
}

function fromPayload(payload: DropActorSheetDataActorItemPayload): Currency {
  return {
    cp: 0,
    sp: 0,
    ep: 0,
    gp: payload.data.data.price,
    pp: 0,
  }
}

/**
 * Derive currency from an item price
 */
function fromItem(item: game.dnd5e.entities.Item5e): Currency {
  const gp = item.data.data.price
  return fromGp(gp)
}

function fromGp(gp: number): Currency {
  const cp = gp * 2 * 5 * 10
  if (Math.floor(cp) !== cp) {
    notify.error(`price ${gp}gp cannot be converted into currency, too small`)
    throw new Error('failed to generate item currency')
  }
  return normalize(create({ cp }))
}

function subtract(
  currency: Currency,
  delta: Currency,
  normalized = false,
): Currency {
  if (!normalized) {
    return subtract(normalize(currency), normalize(delta), true)
  }
  if (isLessThan(currency, delta, true)) {
    throw new Error(
      `not enough in ${toString(currency)} to subtract ${toString(delta)}`,
    )
  }
  const fresh = create(currency)

  // pp
  fresh.pp = fresh.pp - delta.pp
  fresh.gp = fresh.gp + fresh.pp * 10
  fresh.pp = 0

  // gp
  fresh.gp = fresh.gp - delta.gp
  fresh.ep = fresh.ep + fresh.gp * 2
  fresh.gp = 0

  // sp
  fresh.ep = fresh.ep - delta.ep
  fresh.sp = fresh.sp + fresh.ep * 5
  fresh.ep = 0

  // ep
  fresh.sp = fresh.sp - delta.sp
  fresh.cp = fresh.cp + fresh.sp * 10
  fresh.sp = 0

  // cp
  fresh.cp = fresh.cp - delta.cp

  return normalize(fresh)
}

function add(currency: Currency, delta: Currency) {
  const fresh = create()
  for (const key of keys(currency)) {
    fresh[key] = currency[key] + delta[key]
  }
  return fresh
}

interface TransferArgs {
  from: Currency
  to: Currency
  amount: Currency
}

function transfer({ from, to, amount }: TransferArgs) {
  return {
    from: subtract(from, amount),
    to: add(to, amount),
  }
}

function updateActor(actor: Actor5e, currency: Currency): Promise<Actor5e> {
  const nestedData = actor.data.data
  const updatedNestedData = { ...nestedData, currency: normalize(currency) }
  return actor.update({ data: updatedNestedData })
}

function toString(currency: Currency): string {
  return keys(currency)
    .filter((key) => !!currency[key])
    .slice()
    .sort((a, b) => rank(b) - rank(a))
    .map((key) => `${currency[key]}${key[0]}`)
    .join(', ')
}

function rank(key: keyof Currency): number {
  switch (key) {
    case 'pp': return 5
    case 'gp': return 4
    case 'ep': return 3
    case 'sp': return 2
    case 'cp': return 1
  }
}

export {
  fromActor,
  fromPayload,
  fromItem,
  isMoreThan,
  isEqualTo,
  isLessThan,
  isMoreThanOrEqualTo,
  isLessThanOrEqualTo,
  normalize,
  transfer,
  updateActor,
  toString,
  subtract,
  add,
  create,
  fromGp,
}
