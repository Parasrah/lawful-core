interface ActionBase<T extends string> {
  type: T
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

type MultiTransactionAction = ActionBase<'multi-transaction'> &
  InteractionArgs &
  ItemArgs &
  DirectionArgs

type SellAction = ActionBase<'sell'> & InteractionArgs & ItemArgs

type Action = PurchaseAction | SellAction | MultiTransactionAction

export {
  ActionBase,
  Action,
  PurchaseAction,
  SellAction,
  MultiTransactionAction,
}
