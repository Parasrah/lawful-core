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

function isEqualTo(left: Currency, right: Currency): boolean {
  return (
    left.pp === right.pp &&
    left.gp === right.gp &&
    left.ep === right.ep &&
    left.sp === right.sp &&
    left.cp === right.cp
  )
}

function isLessThan(left: Currency, right: Currency): boolean {
  return !isMoreThanOrEqualTo(left, right)
}

function isMoreThanOrEqualTo(left: Currency, right: Currency) {
  return isEqualTo(left, right) || isMoreThan(left, right)
}

function isLessThanOrEqualTo(left: Currency, right: Currency) {
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
  const converted = source / ratio
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

export {
  fromActor,
  fromPayload,
  isMoreThan,
  isEqualTo,
  isLessThan,
  isMoreThanOrEqualTo,
  isLessThanOrEqualTo,
  normalize,
}
