type Direction = 'to-player' | 'from-player'

interface LogMessage {
  type: 'info' | 'error'
  msg: string
}

declare namespace game {
  declare namespace lawful {
    declare namespace loot {
      /**
       * Purchase an item for a player from a merchant
       */
      declare function purchase(opts: SubAction<PurchaseAction>): Promise<LogMessage>

      /**
       * Sell an item from a player to a merchant
       */
      declare function sell(opts: SubAction<SellAction>): Promise<LogMessage>

      /**
       * Prompt a player for an item count
       */
      declare function promptForItemCount(opts: SubAction<MultiTransactionAction>): Promise<number>
    }
  }
}
