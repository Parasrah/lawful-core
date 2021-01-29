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

function isInput(html: HTMLElement): html is HTMLInputElement {
  return html.nodeName === 'INPUT'
}

function isIn<O extends {}>(
  o: O,
  key: string | number | symbol,
): key is keyof O {
  return key in o
}

export { isObj, isActorItem, isInput, isIn }
