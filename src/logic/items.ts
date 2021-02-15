type Item5e = game.dnd5e.entities.Item5e

function compare(left: Item5e, right: Item5e): boolean {
  const allowedTypes: game.dnd5e.entities.ItemType[] = [
    'consumable',
    'loot',
  ]

  if (left.data.type !== right.data.type) {
    return false
  }
  if (!allowedTypes.includes(right.data.type)) {
    return false
  }
  if (left.name !== right.name) {
    return false
  }
  const {
    data: { data: leftData },
  } = left
  const {
    data: { data: rightData },
  } = right
  if (leftData.price !== rightData.price) {
    return false
  }
  if (leftData.damage !== rightData.damage) {
    return false
  }
  if (leftData.identified !== rightData.identified) {
    return false
  }

  return true
}

export { compare }
