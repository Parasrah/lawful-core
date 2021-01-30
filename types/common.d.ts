type Predicate<T> = (x: T) => boolean

interface Position {
  width: number,
  height: number,
  left: number,
  top: number,
  scale: number,
}

type Tuple2<A, B> = [A, B]

type Tuple3<A, B, C> = [A, B, C]
