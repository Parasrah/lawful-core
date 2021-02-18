function assertNever(_: never): never {
  throw new Error('expected exection of "never" code path')
}

export { assertNever }
