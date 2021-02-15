import getParticipants, { Direction } from '../util/getParticipants'

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

  public onCancel() {
    this.data.close()
  }

  public onSubmit() {
    // TODO: fix this to actually use a count
    this.data.submit(1)
  }

  public static get defaultOptions() {
    return {
      ...super.defaultOptions,
      template: 'templates/apps/multi-transaction.html',
    }
  }

  public static sell(opts: ActionOpts) {
    return this.create(opts, 'from-player')
  }

  public static purchase(opts: ActionOpts) {
    return this.create(opts, 'to-player')
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
