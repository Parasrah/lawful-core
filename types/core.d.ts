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

declare abstract class Entity<Data extends {}> {
  public data: EntityData & Data

  public get owner(): boolean
  public get limited(): boolean
  public get visible(): boolean
  public get entity(): string
  public get name(): string
  public get uuid(): string
  public get link(): string
  public get sheet(): BaseEntitySheet
  public get hasPlayerOwner(): boolean

  protected constructor()

  protected prepareData(): void
  protected prepareEmbeddedEntities(): void

  public setFlag<T>(scope: string, key: string, value: T): Promise<this>

  public getFlag<T>(scope: string, key: string): T | undefined

  public unsetFlag(scope: string, key: string): Promise<this>

  public clone(
    data: EntityData & D,
    options: Partial<EntityCreateOptions> = {},
  ): Promise<this>

  public update(
    data: Partial<Data>,
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
    data: Data | Data[],
    options: Partial<EntityCreateOptions> = {},
  ): Promise<Entity<Data> | Entity<Data>[]>

  public static update(
    data: Partial<Data> | Partial<Data>[],
    options: Partial<EntityUpdateOptions> = {},
  ): Promise<Entity<Data> | Entity<Data>[]>

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

declare class Application<D extends {}, O extends {}> {
  protected constructor(...args: unknown[])

  protected options: O & ApplicationOptions
  public get id(): string
  public get element(): HTMLElement
  public get template(): string
  public get popOut(): boolean
  public get rendered(): boolean
  public get title(): string

  public getData(): D
  public activateListeners(html: JQuery<HTMLElement>): void

  public static get defaultOptions(): O & ApplicationOptions
}

interface FormApplicationOptions {
  closeOnSubmit: boolean
  submitOnChange: boolean
  submitOnClose: boolean
  editable: boolean
}

declare abstract class FormApplication<
  D extends {},
  O extends {}
> extends Application<D, O & FormApplicationOptions> {
  public form: HTMLElement
  public object: D
  public editors: Record<string, FilePicker>
  public get isEditable(): boolean
}

interface BaseEntitySheetOptions {
  cssClass: string
}

declare abstract class BaseEntitySheet<
  D extends {},
  O extends {},
  E extends Entity<D> = Entity<D>
> extends FormApplication<O & BaseEntitySheetOptions, E> {
  public get entity(): E
}

interface FilePickerOptions {
  tileSize: boolean
}

declare abstract class FilePicker<O extends {}> extends Application<
  O & FilePickerOptions
> {
  protected constructor(options: O & FilePickerOptions)
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

interface ActorData {}

declare class Actor<D extends {}> extends Entity<D & ActorData> {
  public limited: boolean

  protected constructor()

  protected prepareDerivedData(): void
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

declare abstract class ActorSheet<
  O extends {},
  D extends {}
> extends BaseEntitySheet<O, D, Entity<D>> {
  public actor: Actor<D>
}

/* ---------- Items ---------- */

interface ItemData {}

declare class Item<D extends {}> extends Entity<ItemData & D> {
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
