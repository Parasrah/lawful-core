declare namespace game {
  declare const view: string
  declare const actors: Map<string, game.dnd5e.entities.Actor5e>
  declare const user: User
  declare const i18n: I18n

  declare namespace dnd5e {
    declare namespace entities {
      interface ActorData5e {
        data: {
          currency: {
            cp: number
            ep: number
            gp: number
            pp: number
            sp: number
          }
        }
      }

      declare class Actor5e extends Actor<ActorData5e> {
        public isPC: boolean

        protected constructor()

        static create(data: Partial<ActorData5e>): Promise<Actor5e>
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

      interface Item5eData {
        name: string
        type: ItemType
        data: unknown
        flags: unknown
        img: string
        effects: unknown[]
        labels: Record<string, string>
        isStack: boolean
        hasUses: boolean
        hasTarget: boolean
        toggleClass: string
        toggleTitle: string
        totalWeight: number
        owner: boolean
        notFeat: boolean
        data: {
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
          activation: unknown
          duration: unknown
          target: unknown
          range: unknown
          uses: unknown
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
        }
      }

      declare class Item5e extends Item<Item5eData> {
        id: string
      }
    }

    declare namespace applications {
      interface ActorSheet5eOptions {}

      interface ActorSheet5eData {}

      declare class ActorSheet5e extends ActorSheet<
        ActorSheet5eOptions,
        ActorSheet5eData
      > {}

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
  data: Item5eData
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
      [game.dnd5e.entities.Actor5e, ActorSheet, DropActorSheetDataPayload]
    >,
  ): number
}

/* ----------- Utilities ----------- */

declare function mergeObject<X, Y>(original: X, other: Y): X & Y

declare function duplicate<T extends {}>(original: T): T

declare function getProperty<O extends {}, K extends keyof O>(o: O, k: K): O[K]
