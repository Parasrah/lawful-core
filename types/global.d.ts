declare namespace game {
  declare const view: string
  declare const actors: Map<string, game.dnd5e.entities.Actor5e>
  declare const user: User
  declare const i18n: I18n

  declare namespace dnd5e {
    declare namespace entities {
      interface Actor5eNestedData extends ActorNestedData {
        currency: Currency
      }

      interface Actor5eData extends ActorData {
        data: Actor5eNestedData
      }

      declare class Actor5e extends Actor<Actor5eData, Item5e> {
        public isPC: boolean

        protected constructor()

        static create(data: Partial<Actor5eData>): Promise<Actor5e>
      }

      type ItemType =
        | 'feat'
        | 'class'
        | 'loot'
        | 'weapon'
        | 'equipment'
        | 'consumable'
        | 'backpack'
        | 'loot'
        | 'tool'
        | 'spell'

      interface Item5eNestedData extends ItemNestedData {
        components: { ritual: boolean; concentration: boolean }
        level: number
        preparation: { mode: string; prepared: boolean }
        description: string
        source: unknown
        quantity: number
        weight: number
        price: number
        attuned: boolean
        attunement: number
        equipped: boolean
        rarity: 'Common'
        identified: boolean
        activation: { type?: string }
        duration: unknown
        target: { type: string }
        range: unknown
        uses?: { max: number; per: number; value: number }
        consume: unknown
        ability: unknown
        actionType: unknown
        attackBonus: unknown
        chatFlavor: unknown
        critical: unknown
        damage: unknown
        formula: unknown
        save: unknown
        consumableType: string
        recharge?: { value: number; charged: boolean }
      }

      interface Item5eData extends ItemData {
        _id: string
        name: string
        type: ItemType
        data: Item5eNestedData
        flags: unknown
        img: string
        levels: number
        effects: unknown[]
        isStack: boolean
        hasUses: boolean
        isOnCooldown: boolean
        hasTarget: boolean
        toggleClass: string
        toggleTitle: string
        totalWeight: number
        owner: boolean
        notFeat: boolean
        isDepleted: boolean
        attunement?: {
          icon: string
          cls: string
          title: string
        }
      }

      declare class Item5e extends Item<Item5eData> {
        id: string
        labels: Record<string, string>
      }
    }

    declare namespace applications {
      interface ActorSheet5eOptions {}

      interface ActorSheet5eData {
        cssClass: string
      }

      declare class ActorSheet5e extends ActorSheet<
        ActorSheet5eOptions,
        ActorSheet5eData,
        game.dnd5e.entities.Actor5e
      > {
        public getData(): ActorSheet5eData
      }

      declare class ActorSheet5eNPC extends ActorSheet5e {}
    }
  }
}

declare namespace ui {
  declare namespace notifications {
    declare function info(message: string, options?: object): void
    declare function error(message: string, options?: object): void
  }
}

/* ----------- Hooks ----------- */

type Hook<E extends string, A extends []> = (
  event: E,
  listener: (...args: A) => boolean | void,
) => number

type Listener<A extends []> = (...args: A) => boolean

interface DropActorSheetDataBasePayload {
  type: string
}

interface DropActorSheetDataActorItemPayload
  extends DropActorSheetDataBasePayload {
  type: 'Item'
  actorId: string
  sceneId: string | null
  data: game.dnd5e.entities.Item5eData
}

interface DropActorSheetDataCompendiumItemPayload
  extends DropActorSheetDataBasePayload {
  pack: string
  id: string
}

type DropActorSheetDataPayload =
  | DropActorSheetDataActorItemPayload
  | DropActorSheetDataCompendiumItemPayload

declare class Hooks {
  static on(
    e: 'renderPlayerList',
    l: Listener<[unknown, unknown, RenderPlayerListOpts]>,
  ): number

  static once(
    e: 'renderPlayerList',
    l: Listener<[unknown, unknown, RenderPlayerListOpts]>,
  ): number

  static on(
    e: 'dropActorSheetData',
    l: Listener<
      [
        game.dnd5e.entities.Actor5e,
        ActorSheet<
          ActorSheetOptions,
          ActorSheetData,
          game.dnd5e.entities.Actor5e
        >,
        DropActorSheetDataPayload,
      ]
    >,
  ): number
}

/* ----------- Domain Types ----------- */

interface Currency {
  cp: number
  ep: number
  gp: number
  pp: number
  sp: number
}

/* ----------- Utilities ----------- */

declare function mergeObject<X, Y>(original: X, other: Y): X & Y

declare function duplicate<T extends {}>(original: T): T

declare function getProperty<O extends {}, K extends keyof O>(o: O, k: K): O[K]

/* ----------- Constants ----------- */

declare const DEFAULT_TOKEN: string

interface Config {
  DND5E: {
    attunementTypes: {
      REQUIRED: number
      ATTUNED: number
    }
  }
}

declare const CONFIG: Config

/* ----------- Global Pollution ----------- */

interface Number {
  toNearest(decimal: number): number
}
