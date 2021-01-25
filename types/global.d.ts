declare namespace game {
  declare const view: string
  declare const actors: Map<string, Actor5e>
  declare const user: User

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

      declare class Item5e extends Item {
        id: string
      }
    }

    declare namespace applications {
      declare class ActorSheet5e extends ActorSheet {}

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

declare function mergeObject<X, Y>(original: X, other: Y): X & Y

declare function duplicate<T extends {}>(original: T): T
