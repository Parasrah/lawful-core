function keys<T extends object>(o: T): Array<keyof T> {
  return (Object.keys(o) as any) as Array<keyof T>
}

export { keys }
