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

type SellAction = ActionBase<'sell'> & InteractionArgs & ItemArgs

type Action = PurchaseAction | SellAction

export { ActionBase, Action, PurchaseAction, SellAction }
