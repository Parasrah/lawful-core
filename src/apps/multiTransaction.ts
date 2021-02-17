import getParticipants from '../util/getParticipants'

interface Options extends ApplicationOptions {}

interface Data extends ApplicationData {
  title: string
  itemId: string
  playerId: string
  merchantId: string
  direction: Direction

  close(): void
  submit(count: number): void
}

interface ActionOpts {
  playerId: string
  merchantId: string
  itemId: string
}

class MultiTransaction extends Application<Options, Data> {
  private data: Data
  private form?: HTMLFormElement

  public constructor(data: Data, ...options: unknown[]) {
    super(...options)

    this.data = data

    this.onSubmit = this.onSubmit.bind(this)
    this.onCancel = this.onCancel.bind(this)
  }

  public getData() {
    const data = {
      ...super.getData(),
    }

    return data
  }

  public onSubmit(event: Event) {
    event.preventDefault()
    // TODO: fix this to actually use a count
    // TODO: fix this to close
    this.data.submit(1)
  }

  public static get defaultOptions() {
    return {
      ...super.defaultOptions,
      template: 'modules/lawful-loot/templates/apps/multi-transaction.html',
    }
  }

  public static sell(opts: ActionOpts) {
    return this.create(opts, 'from-player')
  }

  public static purchase(opts: ActionOpts) {
    return this.create(opts, 'to-player')
  }

  public async close(options: unknown) {
    setTimeout(this.onCancel, 0)
    super.close(options)
  }

  protected activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html)
    this.form!.onsubmit = this.onSubmit
  }

  protected async _renderInner(...args: unknown[]) {
    const html = await super._renderInner(...args)
    const form =
      html[0] instanceof HTMLFormElement ? html[0] : html.find('form')[0]

    if (!form) {
      throw new Error('failed to find form')
    }
    this.form = form

    return html
  }

  private onCancel() {
    if (this.data.close) {
      this.data.close()
    }
  }

  private static create(
    opts: ActionOpts,
    direction: Direction,
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      const { item, lootActor: merchant } = getParticipants({
        ...opts,
        lootActorId: opts.merchantId,
        direction,
      })
      const app = new this({
        title: `Sell ${item.name}(s) to ${merchant.name}`,
        itemId: opts.itemId,
        merchantId: opts.merchantId,
        playerId: opts.merchantId,
        direction,
        close() {
          reject('multi-transaction was cancelled')
        },
        submit(count: number) {
          resolve(count)
        },
      })
      app.render(true)
    })
  }
}

export default MultiTransaction
