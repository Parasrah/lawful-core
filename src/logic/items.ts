type Item5e = game.dnd5e.entities.Item5e

function canStack(item: Item5e) {
  const allowedTypes: game.dnd5e.entities.ItemType[] = ['consumable', 'loot']
  if (!allowedTypes.includes(item.data.type)) {
    return false
  }
  return true
}

function compare(left: Item5e, right: Item5e): boolean {
  if (left.data.type !== right.data.type) {
    return false
  }
  if (!canStack(left)) {
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
  if (leftData.uses?.max !== rightData.uses?.max) {
    return false
  }
  if (leftData.uses?.per !== rightData.uses?.per) {
    return false
  }
  if (leftData.uses?.value !== rightData.uses?.value) {
    return false
  }

  return true
}

export { compare, canStack }
