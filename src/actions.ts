interface ActionBase<T extends string> {
  type: T
  scope: string
}

type PurchaseAction = ActionBase<'purchase'> & InteractionArgs & ItemArgs

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

type MultiTransactionAction = ActionBase<'multi-transaction'> &
  InteractionArgs &
  ItemArgs &
  DirectionArgs

type SellAction = ActionBase<'sell'> & InteractionArgs & ItemArgs

type ResponseAction<R> = ActionBase<'response'> & ResponseArgs<R>

type Action<R = never> = PurchaseAction | SellAction | MultiTransactionAction | ResponseAction<R>

type SubAction<A extends ActionBase<string>> = Omit<A, 'type' | 'scope'>

function isResponse<R>(scope: string, action: Action<R>): action is ResponseAction<R> {
  return action.type === 'response' && action.scope === scope
}

export {
  ActionBase,
  Action,
  PurchaseAction,
  SellAction,
  MultiTransactionAction,
  SubAction,
  ResponseAction,
  isResponse,
}
