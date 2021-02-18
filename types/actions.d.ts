interface BaseAction<T extends string> {
  type: T
  scope: string
  source: string
}

interface TargetedAction<T extends string> extends BaseAction<T> {
  target: string
}

type PurchaseAction = BaseAction<'purchase'> & InteractionArgs & ItemArgs

interface InteractionArgs {
  playerId: string
  merchantId: string
}

interface ItemArgs {
  itemId: string
}

interface DirectionArgs {
  direction: Direction
}

interface ResponseArgs<R> {
  response: R
}

type MultiTransactionAction = TargetedAction<'multi-transaction'> &
  InteractionArgs &
  ItemArgs &
  DirectionArgs

type SellAction = BaseAction<'sell'> & InteractionArgs & ItemArgs

type ResponseAction<R> = BaseAction<'response'> & ResponseArgs<R>

type Action<R = never> = PurchaseAction | SellAction | MultiTransactionAction | ResponseAction<R>

type SubAction<A extends BaseAction<string>> = Omit<A, 'type' | 'scope' | 'source'>
