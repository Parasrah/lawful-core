import LawfulLootSheet, { LawfulLootSheetData, LawfulLootSheetOptions } from './base'

interface LawfulLootContainerOptions extends LawfulLootSheetOptions {
}

interface LawfulLootContainerData extends LawfulLootSheetData {
}

/**
 * Only capable of holding loot items and currency
 */
class LawfulLootContainer extends LawfulLootSheet<LawfulLootContainerOptions, LawfulLootContainerData> {
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
