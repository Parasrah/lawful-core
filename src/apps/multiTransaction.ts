import getParticipants from '../util/getParticipants'
import notify from '../util/notify'
import { isInput } from '../util/typeguards'
import wait from '../util/wait'

interface Options extends FormApplicationOptions {}

interface Data extends FormApplicationData {
  max: number
}

interface ActionOpts {
  playerId: string
  merchantId: string
  itemId: string
}

interface FormObject {
  submitted: boolean
  count: number
}

interface TransactionProperties {
  title: string
  itemId: string
  playerId: string
  merchantId: string
  direction: Direction

  close(): void
  submit(count: number): void
}

class MultiTransaction extends FormApplication<Options, Data, FormObject> {
  private props: TransactionProperties

  public constructor(
    props: TransactionProperties,
    options: Partial<Options> = {},
  ) {
    super(
      { submitted: false, count: 1 },
      {
        ...options,
        submitOnClose: false,
        submitOnChange: false,
      },
    )

    this.props = Object.freeze(props)

    this.onChangeRange = this.onChangeRange.bind(this)
  }

  private get submitButton() {
    return this.element.find('.mt-button[type="submit"]')
  }

  private get item() {
    const { props } = this
    const actorId =
      props.direction === 'from-player' ? props.playerId : props.merchantId
    const actor = game.actors.get(actorId)
    const item = actor?.getOwnedItem(this.props.itemId)
    return item
  }

  private get quantity() {
    return this.item?.data?.data?.quantity
  }

  public get title() {
    return this.props.title
  }

  public getData(): Data {
    if (!this.item) {
      notify.error('item or actor is no longer available')
      this.close()
    }
    const data = {
      ...super.getData(),
      max: this.quantity ?? 1,
      count: this.object.count,
    }

    return data
  }

  public static get defaultOptions() {
    return {
      ...super.defaultOptions,
      template: 'modules/lawful-loot/templates/apps/multi-transaction.html',
      width: 400,
      height: 110,
    }
  }

  public static sell(opts: ActionOpts) {
    return this.create(opts, 'from-player')
  }

  public static purchase(opts: ActionOpts) {
    return this.create(opts, 'to-player')
  }

  public async close(options?: unknown) {
    if (this.object.submitted && this.props.submit) {
      wait().then(() => this.props.submit(this.object.count))
    } else if (!this.object.submitted && this.props.close) {
      wait().then(() => this.props.close())
    }
    super.close(options)
  }

  protected activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html)

    html.find('.mt-slider>input[type="range"]').on('input', this.onChangeRange)
    html.find('.mt-button.cancel').on('click', () => this.close())
  }

  protected async _updateObject(event: Event) {
    if (event.type === 'submit') {
      this.object.submitted = true
    }
    if (event.type === 'input') {
      const input = event.currentTarget
      if (isInput(input)) {
        if (input.name === 'mt-slider') {
          this.object.count = Number(input.value)
        }
      }
    } else {
      console.log(event)
    }
  }

  protected async onChangeRange(event: Event) {
    event.preventDefault()
    this._updateObject(event)
    if (this.submitButton) {
      this.submitButton.html(`Sell ${this.object.count}`)
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
        playerId: opts.playerId,
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
