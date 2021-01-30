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
      movement: this.getMovement(actorData),
    }
  }

  public activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html)
  }

  // source: https://gitlab.com/foundrynet/dnd5e/-/blob/3fada7e4849ebd1c3ea6420b00cf3504b13055e1/module/actor/sheets/base.js
  private getMovement(actorData: ActorData, largestPrimary = false) {
    const movement = actorData.data.attributes.movement || {}

    // Prepare an array of available movement speeds
    let speeds: Tuple2<number, string>[] = [
      [
        movement.burrow,
        `${game.i18n.localize('DND5E.MovementBurrow')} ${movement.burrow}`,
      ],
      [
        movement.climb,
        `${game.i18n.localize('DND5E.MovementClimb')} ${movement.climb}`,
      ],
      [
        movement.fly,
        `${game.i18n.localize('DND5E.MovementFly')} ${movement.fly}` +
          (movement.hover
            ? ` (${game.i18n.localize('DND5E.MovementHover')})`
            : ''),
      ],
      [
        movement.swim,
        `${game.i18n.localize('DND5E.MovementSwim')} ${movement.swim}`,
      ],
    ]
    if (largestPrimary) {
      speeds.push([
        movement.walk,
        `${game.i18n.localize('DND5E.MovementWalk')} ${movement.walk}`,
      ])
    }

    // Filter and sort speeds on their values
    speeds = speeds.filter((s) => !!s[0]).slice().sort((a, b) => b[0] - a[0])

    // Case 1: Largest as primary
    if (largestPrimary) {
      const primary = speeds.shift()
      return {
        primary: `${primary ? primary[1] : '0'} ${movement.units}`,
        special: speeds.map((s) => s[1]).join(', '),
      }
    }

    // Case 2: Walk as primary
    else {
      return {
        primary: `${movement.walk || 0} ${movement.units}`,
        special: speeds.length ? speeds.map((s) => s[1]).join(', ') : '',
      }
    }
  }

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      width: 550,
      height: 680,
    }
  }
}

export { LawfulLootSheetOptions }
export default LawfulLootSheet
