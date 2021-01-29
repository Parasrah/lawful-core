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

export { isObj, isActorItem }
