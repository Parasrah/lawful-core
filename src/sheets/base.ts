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
    return this.entity.owner
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

  public activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html)
  }

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      width: 720,
      height: 680,
    }
  }
}

export { LawfulLootSheetOptions }
export default LawfulLootSheet
