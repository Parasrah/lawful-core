import LawfulLootSheet from './base'

/**
 * An actor that players can buy/sell items from/to
 */
class LawfulLootMerchant extends LawfulLootSheet {
  get template() {
    if (!game.user.isGM && this.actor.limited) {
      return 'modules/lawful-loot/templates/actors/lawful-loot-merchant-ltd.html'
    } else {
      return 'modules/lawful-loot/templates/actors/lawful-loot-merchant.html'
    }
  }
}

export default LawfulLootMerchant
