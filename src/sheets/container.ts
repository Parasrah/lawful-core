import LawfulLootSheet from './base'

/**
 * Only capable of holding loot items and currency
 */
class LawfulLootContainer extends LawfulLootSheet {
  get template() {
    if (!game.user.isGM && this.actor.limited) {
      return 'modules/lawful-loot/templates/actors/lawful-loot-container-ltd.html'
    } else {
      return 'modules/lawful-loot/templates/actors/lawful-loot-container.html'
    }
  }

  activeListeners(html: JQuery<HTMLElement>) {
    if (this.isEditable) {
    }

    if (this.isEditable && this.isOwner) {
    }
  }
}

export default LawfulLootContainer
