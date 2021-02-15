/* ---------- jQuery ---------- */

type ClickEvent<T extends HTMLElement> = JQuery.ClickEvent<T, null, T, T>

type ChangeEvent<T extends HTMLElement> = JQuery.ChangeEvent<T, null, T, T>

/* ---------- Entity ---------- */

interface EntityData {
  sort: number
}

interface EntityOptions {}

interface EntityCreateOptions {
  temporary: boolean
  renderSheet: boolean
  noHook: boolean
}

interface EntityUpdateOptions {
  diff: boolean
  noHook: boolean
}

interface GetEmbeddedEntityOptions {
  strict: boolean
}

interface CreateEmbeddedEntityOptions {
  temporary: boolean
  renderSheet: boolean
  noHook: boolean
}

declare abstract class Entity<D extends EntityData> {
  public data: D

  public get owner(): boolean
  public get limited(): boolean
  public get visible(): boolean
  public get entity(): string
  public get name(): string
  public get uuid(): string
  public get id(): string
  public get link(): string
  public get sheet(): BaseEntitySheet
  public get hasPlayerOwner(): boolean
  public get permission(): number

  protected constructor()

  protected prepareData(): void
  protected prepareEmbeddedEntities(): void

  public setFlag<T>(scope: string, key: string, value: T): Promise<this>

  public getFlag<T>(scope: string, key: string): T | undefined

  public unsetFlag(scope: string, key: string): Promise<this>

  public clone(
    data: Partial<EntityData & D> = {},
    options: Partial<EntityCreateOptions> = {},
  ): Promise<this>

  public update(
    data: DeepPartial<D>,
    options: Partial<EntityUpdateOptions> = {},
  ): Promise<this>

  public delete(): Promise<this>

  public getEmbeddedEntity<E extends {}>(
    name: string,
    id: string,
    options: Partial<GetEmbeddedEntityOptions> = {},
  ): E | null

  public createEmbeddedEntity<E>(
    name: string,
    data: E | E[],
    options: Partial<CreateEmbeddedEntityOptions> = {},
  ): Promise<E | E[]>

  public static get config(): O

  public static create(
    data: D | D[],
    options: Partial<EntityCreateOptions> = {},
  ): Promise<Entity<D> | Entity<D>[]>

  public static update(
    data: DeepPartial<D> | DeepPartial<D>[],
    options: Partial<EntityUpdateOptions> = {},
  ): Promise<Entity<D> | Entity<D>[]>

  public static can<T>(user: User, action: string, target: Entity<T>): boolean
}

interface EntityCollection<T> {
  name: string

  get(key: string, strict: boolean): Entity<T> | null
  getName(name: string, strict: boolean): Entity<T> | null
  find(predicate: Predicate<Entity<T>>): Entity<T> | null
}

interface RegisterSheetOpts {
  makeDefault: boolean
  types: string[]
}

declare abstract class EntitySheetConfig {
  public static registerSheet<T>(
    entity: Entity<T>,
    scope: string,
    sheetClass: Application,
    options?: Partial<RegisterSheetOpts>,
  ): void
}

/* ------- Application ------- */

interface ApplicationOptions {
  baseApplication: null
  width: number
  height: number
  top: number
  left: number
  popOut: true
  minimizable: boolean
  resizable: boolean
  id: string
  classes: string[]
  dragDrop: unknown[]
  tabs: unknown[]
  filters: unknown[]
  title: string
  template: string
  scrollY: unknown[]
}

interface ApplicationData {}

declare abstract class Application<
  O extends ApplicationOptions,
  D extends ApplicationData
> {
  protected constructor(...args: unknown[])

  protected options: O
  public get id(): string
  public get element(): HTMLElement
  public get template(): string
  public get popOut(): boolean
  public get rendered(): boolean
  public get title(): string

  public getData(): ApplicationData
  public activateListeners(html: JQuery<HTMLElement>): void
  public render(force = false, options = {}): void

  public static get defaultOptions(): O & ApplicationOptions
}

interface FormApplicationOptions extends ApplicationOptions {
  closeOnSubmit: boolean
  submitOnChange: boolean
  submitOnClose: boolean
  editable: boolean
}

interface FormApplicationData extends ApplicationData {}

declare abstract class FormApplication<
  O extends FormApplicationData,
  D extends FormApplicationOptions,
  E
> extends Application<O, D> {
  public form: HTMLElement
  public object: E
  public editors: Record<string, FilePicker>
  public get isEditable(): boolean
  public getData(): FormApplicationData
}

interface BaseEntitySheetOptions extends FormApplicationOptions {
  cssClass: string
}

interface BaseEntitySheetData extends FormApplicationData {
  cssClass: string
}

declare abstract class BaseEntitySheet<
  O extends BaseEntitySheetOptions,
  D extends BaseEntitySheetData,
  E extends Entity<EntityData>
> extends FormApplication<O, D, E> {
  public get entity(): E
  public getData(): BaseEntitySheetData
}

interface FilePickerOptions {
  tileSize: boolean
}

declare abstract class FilePicker<O extends {}> extends Application<
  O & FilePickerOptions
> {
  protected constructor(options: O & FilePickerOptions)
}

interface DialogOptions extends ApplicationOptions {}

interface DialogData extends ApplicationData {}

declare class Dialog extends Application<DialogOptions, DialogData> {
  public static confirm(opts: ConfirmOpts)
}

/* ---------- Rolls ---------- */

declare class Roll {
  public total: number | null

  public constructor(formula: string, data: object)

  public evaluate(minimize?: boolean, maximize?: boolean): Roll
}

interface DrawResult {
  roll: Roll
  results: unknown[]
}

/* ---------- RollTables ---------- */

interface FromFolderOpts {}

interface RollTableData {}

declare class RollTable extends Entity<RollTableData> {
  public constructor()

  public draw(
    roll?: Roll | null,
    recursive?: boolean,
    results?: unknown[],
    displayChat?: boolean,
    rollMode?: string | null,
  ): Promise<DrawResult>

  public drawMany(
    count: number,
    roll?: Roll | null,
    recursive?: boolean,
    displayChat?: boolean,
    rollMode?: string | null,
  ): Promise<DrawResult>

  public roll(
    roll: Roll | undefined,
    resursive: boolean,
    _depth: number,
  ): unknown

  public static fromFolder(
    folder: Folder,
    options: FromFolderOpts,
  ): Promise<RollTable>
}

declare class RollTableConfig {
  public title: string

  public constructor(table: RollTable, options: never)
}

interface RenderRollTableConfigOpts {
  cssClass: string
  editable: boolean
  entity: RollTable
  limited: boolean
  owner: boolean
}

/* ---------- Actors ---------- */

interface ActorNestedData {
  abilities: unknown
  attributes: {
    ac: unknown
    hp: unknown
    init: unknown
    movement: {
      burrow: number
      climb: number
      fly: number
      swim: number
      walk: number
      units: number
      hover: number
    }
    senses: unknown
    spellcasting: unknown
    prof: unknown
    encumbrance: unknown
    spelldc: unknown
  }
  details: unknown
  traits: unknown
  currency: unknown
  skills: unknown
  spells: unknown
  bonuses: unknown
  resources: unknown
}

interface ActorData extends EntityData {
  _id: unknown
  name: unknown
  permission: unknown
  type: unknown
  data: ActorNestedData
  sort: unknown
  flags: unknown
  img: unknown
  token: {
    actorLink: boolean
  }
  items: unknown
  effects: unknown
}

declare class Actor<
  D extends ActorData = ActorData,
  I extends Item = Item
> extends Entity<D> {
  public limited: boolean
  public items: FoundryMap<string, I>

  protected constructor()

  protected prepareDerivedData(): void

  public createOwnedItem(data: I['data'], options?: {}): Promise<I['data']>
  public deleteOwnedItem(id: string, options?: {}): Promise<I['data']>
  public getOwnedItem(id: string): I
}

declare class Actors<D extends {}> implements EntityCollection<D> {
  name: string

  public static registerSheet(
    system: string,
    sheetClass: Application,
    options?: Partial<RegisterSheetOpts>,
  ): void

  get(key: string, strict: boolean): Actor<D> | null
  getName(name: string, strict: boolean): Actor<D> | null
  find(predicate: Predicate<Actor<D>>): Actor<D> | null
}

interface ActorSheetOptions {}

interface ActorSheetData {}

declare abstract class ActorSheet<
  O extends ActorSheetOptions,
  D extends ActorSheetData,
  A extends Actor
> extends BaseEntitySheet<O, D, A> {
  public actor: A
  public getData(): ActorSheetData
}

/* ---------- Items ---------- */

interface ItemNestedData {}

interface ItemData {
  data: ItemNestedData
}

declare class Item<D extends ItemData = ItemData> extends Entity<D> {
  public constructor()
}

/* ---------- Users ---------- */

interface UserData {}

interface User extends Entity<UserData> {
  id: string
  active: boolean
  name: string
  isGM: boolean
}

interface RenderPlayerListOpts {
  hide: boolean
  showOffline: boolean
  users: User[]
}

/* ---------- Folders ---------- */

declare class Folder {}

/* ---------- i18n ---------- */

interface I18nFormatOpts {
  type: string
}

interface I18n {
  localize(key: string): string
  format(key: string, opts: Partial<I18nFormatOpts>): string
}
