import { MODULE } from '../constants'
import { isIn, isInput, isNumeric } from '../util/typeguards'
import LawfulLootSheet, {
  LawfulItemData,
  LawfulLootSheetData,
  LawfulLootSheetOptions,
} from './base'

interface LawfulLootMerchantOptions extends LawfulLootSheetOptions {}

type InventoryType =
  | 'weapon'
  | 'equipment'
  | 'consumable'
  | 'tool'
  | 'backpack'
  | 'loot'

interface InventoryGroup {
  label: string
  items: LawfulItemData[]
  dataset: { type: InventoryType }
}

interface Inventory {
  weapon: InventoryGroup
  equipment: InventoryGroup
  consumable: InventoryGroup
  tool: InventoryGroup
  backpack: InventoryGroup
  loot: InventoryGroup
}

interface LawfulLootMerchantData extends LawfulLootSheetData {
  bioLocked: boolean
  inventory: InventoryGroup[]
}

// TODO: make it so observer can sell/purchase items

/**
 * An actor that players can buy/sell items from/to
 */
class LawfulLootMerchant extends LawfulLootSheet<
  LawfulLootMerchantOptions,
  LawfulLootMerchantData
> {
  public constructor(...args: unknown[]) {
    super(...args)

    this.setBioVisibility = this.setBioVisibility.bind(this)
  }

  get template() {
    if (!game.user.isGM && this.actor.limited) {
      return 'modules/lawful-loot/templates/actors/lawful-loot-merchant-ltd.html'
    } else {
      return 'modules/lawful-loot/templates/actors/lawful-loot-merchant.html'
    }
  }

  public getData() {
    const base = super.getData()

    const data = {
      ...base,
      bioLocked: !this.actor.getFlag<boolean>(MODULE, 'bio-visibility'),
      inventory: [],
    }

    this.prepareItems(data)

    return data
  }

  public activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html)

    if (false) {
      html.find('.bio-lock').click(this.setBioVisibility)
    }
  }

  private prepareItems(data: LawfulLootMerchantData) {
    type InitTuple = Tuple4<
      LawfulItemData[],
      LawfulItemData[],
      LawfulItemData[],
      LawfulItemData[]
    >
    const init: InitTuple = [[], [], [], []]
    // Categorize items as inventory, spellbook, features, and classes
    const inventory: Inventory = {
      weapon: {
        label: 'DND5E.ItemTypeWeaponPl',
        items: [],
        dataset: { type: 'weapon' },
      },
      equipment: {
        label: 'DND5E.ItemTypeEquipmentPl',
        items: [],
        dataset: { type: 'equipment' },
      },
      consumable: {
        label: 'DND5E.ItemTypeConsumablePl',
        items: [],
        dataset: { type: 'consumable' },
      },
      tool: {
        label: 'DND5E.ItemTypeToolPl',
        items: [],
        dataset: { type: 'tool' },
      },
      backpack: {
        label: 'DND5E.ItemTypeContainerPl',
        items: [],
        dataset: { type: 'backpack' },
      },
      loot: {
        label: 'DND5E.ItemTypeLootPl',
        items: [],
        dataset: { type: 'loot' },
      },
    }

    // Partition items by category
    let [items, _spells, _feats, _classes] = data.items.reduce((arr, item) => {
      // Item details
      item.img = item.img || DEFAULT_TOKEN
      item.isStack = isNumeric(item.data.quantity) && item.data.quantity !== 1
      const attunement = {
        [CONFIG.DND5E.attunementTypes.REQUIRED]: {
          icon: 'fa-sun',
          cls: 'not-attuned',
          title: 'DND5E.AttunementRequired',
        },
        [CONFIG.DND5E.attunementTypes.ATTUNED]: {
          icon: 'fa-sun',
          cls: 'attuned',
          title: 'DND5E.AttunementAttuned',
        },
      }[item.data.attunement]
      item.attunement = attunement

      // Item usage
      item.hasUses = !!item.data.uses && item.data.uses.max > 0
      item.isOnCooldown =
        !!item.data.recharge &&
        !!item.data.recharge.value &&
        item.data.recharge.charged === false
      item.isDepleted =
        item.isOnCooldown && !!item.data.uses?.per && item.data.uses.value > 0
      item.hasTarget =
        !!item.data.target && !['none', ''].includes(item.data.target.type)

      // Classify items into types
      if (item.type === 'spell') arr[1].push(item)
      else if (item.type === 'feat') arr[2].push(item)
      else if (item.type === 'class') arr[3].push(item)
      else if (Object.keys(inventory).includes(item.type)) arr[0].push(item)
      return arr
    }, init)

    // Apply active item filters
    items = this.filterItems(items, this.filters.inventory)
    // spells = this._filterItems(spells, this._filters.spellbook)
    // feats = this._filterItems(feats, this._filters.features)

    // Organize items
    for (const i of items) {
      i.data.quantity = i.data.quantity || 0
      i.data.weight = i.data.weight || 0
      i.totalWeight = (i.data.quantity * i.data.weight).toNearest(0.1)
      if (isIn(i.type, inventory)) {
        inventory[i.type].items.push(i)
      }
    }

    // Organize Spellbook and count the number of prepared spells (excluding always, at will, etc...)
    // const spellbook = this._prepareSpellbook(data, spells)
    // const nPrepared = spells.filter((s) => {
    //   return (
    //     s.data.level > 0 &&
    //     s.data.preparation.mode === 'prepared' &&
    //     s.data.preparation.prepared
    //   )
    // }).length

    // Organize Features

    // Assign and return
    data.inventory = Object.values(inventory)
    // data.spellbook = spellbook
    // data.preparedSpells = nPrepared
    // data.features = Object.values(features)
  }

  private async setBioVisibility(event: ClickEvent<HTMLElement>) {
    event.preventDefault()
    const checkbox = event.currentTarget
    if (!isInput(checkbox)) {
      throw new Error('expected "input" for bio visibility')
    }
    const visibility = checkbox.checked
    this.actor.setFlag(MODULE, 'bio-visibility', visibility)
  }

  private _canDragStart() {
    return this.actor.permission >= CONST.ENTITY_PERMISSIONS.OBSERVER
  }

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      classes: ['sheet', 'actor', 'npc', 'lawful-loot', 'lawful-merchant'],
    }
  }
}

export default LawfulLootMerchant
