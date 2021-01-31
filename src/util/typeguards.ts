function isObj(input: unknown): input is Record<string, unknown> {
  return input != null && typeof input === 'object'
}

function isActorItem(
  input: DropActorSheetDataPayload,
): input is DropActorSheetDataActorItemPayload {
  if (!isObj(input)) {
    return false
  }
  const itemType: DropActorSheetDataActorItemPayload['type'] = 'Item'
  if (input.type !== itemType) {
    return false
  }
  const actorIdKey: keyof DropActorSheetDataActorItemPayload = 'actorId'
  if (typeof input[actorIdKey] !== 'string') {
    return false
  }
  return true
}

function isCompendiumItem(
  input: DropActorSheetDataPayload,
): input is DropActorSheetDataCompendiumItemPayload {
  if (!isObj(input)) {
    return false
  }
  const itemType: DropActorSheetDataActorItemPayload['type'] = 'Item'
  if (input.type !== itemType) {
    return false
  }
  const idKey: keyof DropActorSheetDataCompendiumItemPayload = 'id'
  if (typeof input[idKey] !== 'string') {
    return false
  }
  const packKey: keyof DropActorSheetDataCompendiumItemPayload = 'pack'
  if (typeof input[packKey] !== 'string') {
    return false
  }

  return true
}

function isInput(html: HTMLElement): html is HTMLInputElement {
  return html.nodeName === 'INPUT'
}

function isIn<O extends {}>(
  key: string | number | symbol,
  o: O,
): key is keyof O {
  return key in o
}

function isNumeric(n: unknown): n is number {
  if (Array.isArray(n)) {
    return false
  }
  if (n === '') {
    return false
  }
  if (n === null) {
    return false
  }
  if (typeof n === 'number') {
    return true
  }
  if (typeof n === 'string') {
    return !Number.isNaN(Number.parseFloat(n))
  }
  return false
}

export { isObj, isActorItem, isInput, isIn, isNumeric, isCompendiumItem }
