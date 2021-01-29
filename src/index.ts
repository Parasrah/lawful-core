const system = 'dnd5e'

const notify = {
  error: (msg: string) => {
    ui.notifications.error(msg)
  },
  info: (msg: string) => {
    ui.notifications.info(msg)
  },
}

/* ---------- Actors ---------- */

interface LawfulLootSheetOptions {
  rollTable?: RollTable
}

abstract class LawfulLootSheet extends ActorSheet<
  LawfulLootSheetOptions,
  game.dnd5e.entities.ActorData5e
> {
  // TODO: need to associate loot table and formula (how many times to roll)
  // TODO: function to clear & repopulate inventory
  // TODO: should not update actor until we have successfully generated results
  // TODO: show spinner on actor while updating & disable interactions
  // public async repopulateInventory(): Promise<boolean> {
  // }

  private rollTable?: RollTable

  public get isOwner() {
    return this.entity.owner;
  }

  public getData() {
    const { cssClass } = super.getData()
    const { owner } = this.entity

    const actorData = duplicate(this.actor.data)

    return {
      owner,
      cssClass,
      isNPC: false,
      isCharacter: false,
      isVehicle: false,
      isLoot: true,
      rollTable: this.rollTable,
      data: actorData.data,
      actor: actorData,
    }
  }

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
    }
  }
}

// TODO: instead of overriding the _onDropItem (etc) from base class, use hook
// system to listen for when items are dropped, decide whether the transaction
// should take place (return false to prevent the hook propagating), if it does
// perform the transaction (exchange money), and remove the item from the source
// if necessary

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

/* ---------- RollTables ---------- */

function createRowFormulaInput() {
  const input = document.createElement('input')

  input.classList.add('lawful')
  input.classList.add('lawful-row-formula')

  input.placeholder = 'formula'

  return input
}

function createRowCurrencyInput() {
  const input = document.createElement('input')

  input.classList.add('lawful')
  input.classList.add('lawful-row-currency')

  input.placeholder = 'currency'

  return input
}

/* ---------- Mutations ---------- */

Actors.registerSheet(system, LawfulLootContainer, {
  types: ['npc'],
  makeDefault: false,
})

Actors.registerSheet(system, LawfulLootMerchant, {
  types: ['npc'],
  makeDefault: false,
})

class LawfulRollTableConfig extends RollTableConfig {}
