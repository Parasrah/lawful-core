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
      }): void

      /**
       * Sell an item from a player to a merchant
       */
      declare function sell(opts: {
        playerId: string
        merchantId: string
        itemId: string
      }): void
    }
  }
}
