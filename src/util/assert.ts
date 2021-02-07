function assertNever<T = void>(_: never): T {
  throw new Error('expected exection of "never" code path')
}

export { assertNever }
