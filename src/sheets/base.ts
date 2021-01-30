interface LawfulLootSheetOptions extends ActorSheetOptions {
  rollTable?: RollTable
}

interface LawfulItemData extends game.dnd5e.entities.Item5eData {
  labels: Record<string, string>
}

interface LawfulLootSheetData extends ActorSheetData {
  items: LawfulItemData[]
  owner: boolean
  isNPC: boolean
  isCharacter: boolean
  isVehicle: boolean
  isLoot: boolean
  rollTable?: RollTable
  data: game.dnd5e.entities.Actor5eNestedData
  actor: game.dnd5e.entities.Actor5eData
  movement: { primary: string; special: string }
}

type Filter = Set<string>

interface Filters {
  inventory: Filter
}

abstract class LawfulLootSheet<
  O extends LawfulLootSheetOptions,
  D extends LawfulLootSheetData
> extends ActorSheet<O, D, game.dnd5e.entities.Actor5e> {
  // TODO: need to associate loot table and formula (how many times to roll)
  // TODO: function to clear & repopulate inventory
  // TODO: should not update actor until we have successfully generated results
  // TODO: show spinner on actor while updating & disable interactions
  // public async repopulateInventory(): Promise<boolean> {
  // }

  public constructor(...args: unknown[]) {
    super(...args)

    this.filters = {
      inventory: new Set(),
    }
  }

  private rollTable?: RollTable

  protected filters: Filters

  public get isOwner() {
    return this.entity.owner
  }

  public getData(): LawfulLootSheetData {
    const base = super.getData()
    const { owner } = this.entity

    const actorData = duplicate(this.actor.data)

    return {
      ...base,
      owner,
      isNPC: false,
      isCharacter: false,
      isVehicle: false,
      isLoot: true,
      rollTable: this.rollTable,
      data: actorData.data,
      actor: actorData,
      movement: this.getMovement(actorData),
      items: this.actor.items.map((item) => ({
        ...item.data,
        labels: item.labels,
      })),
    }
  }

  public activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html)
  }

  protected filterItems(
    items: LawfulItemData[],
    filters: Filter,
  ): LawfulItemData[] {
    return items.filter((item) => {
      const data = item.data

      // Action usage
      for (const f of ['action', 'bonus', 'reaction']) {
        if (filters.has(f)) {
          if (data.activation && data.activation.type !== f) return false
        }
      }

      // Spell-specific filters
      if (filters.has('ritual')) {
        if (data.components.ritual !== true) return false
      }
      if (filters.has('concentration')) {
        if (data.components.concentration !== true) return false
      }
      if (filters.has('prepared')) {
        if (
          data.level === 0 ||
          ['innate', 'always'].includes(data.preparation.mode)
        )
          return true
        if (this.actor.data.type === 'npc') return true
        return data.preparation.prepared
      }

      // Equipment-specific filters
      if (filters.has('equipped')) {
        if (data.equipped !== true) return false
      }
      return true
    })
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
    speeds = speeds
      .filter((s) => !!s[0])
      .slice()
      .sort((a, b) => b[0] - a[0])

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
      scrollY: [
        '.inventory .inventory-list',
        '.features .inventory-list',
        '.spellbook .inventory-list',
        '.effects .inventory-list',
      ],
      tabs: [
        {
          navSelector: '.tabs',
          contentSelector: '.sheet-body',
          initial: 'description',
        },
      ],
    }
  }
}

export { LawfulLootSheetOptions, LawfulLootSheetData, LawfulItemData }
export default LawfulLootSheet
