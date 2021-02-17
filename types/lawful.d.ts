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
      declare function purchase(opts: {
        playerId: string
        merchantId: string
        itemId: string
      }): Promise<LogMessage>

      /**
       * Sell an item from a player to a merchant
       */
      declare function sell(opts: {
        playerId: string
        merchantId: string
        itemId: string
      }): Promise<LogMessage>

      declare function promptForItemCount(opts: {
        playerId: string
        merchantId: string
        itemId: string
        direction: Direction
      }): Promise<number>
    }
  }
}
