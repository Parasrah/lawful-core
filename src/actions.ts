function isResponse<R>(
  scope: string,
  action: Action<R>,
): action is ResponseAction<R> {
  return action.type === 'response' && action.scope === scope
}

export { isResponse }
