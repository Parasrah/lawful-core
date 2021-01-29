import { scope } from '../constants'
import { isIn, isInput } from '../util/typeguards'
import LawfulLootSheet from './base'

/**
 * An actor that players can buy/sell items from/to
 */
class LawfulLootMerchant extends LawfulLootSheet {
  public constructor(...args: unknown[]) {
    super(...args)

    this.setBioVisibility = this.setBioVisibility.bind(this)
    this.onChangeInputDelta = this.onChangeInputDelta.bind(this)
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

    return {
      ...base,
      bioLocked: !this.actor.getFlag<boolean>(scope, 'bio-visibility'),
    }
  }

  public activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html)
    if (this.isEditable) {
      const inputs = html.find('input')
      inputs.on('focus', (ev) => ev.currentTarget.select())
      inputs
        .addBack()
        .find('[data-dtype="Number"]')
        .trigger('change', this.onChangeInputDelta)
    }

    if (false) {
      html.find('.bio-lock').click(this.setBioVisibility)
    }
  }

  private async setBioVisibility(event: ClickEvent<HTMLElement>) {
    event.preventDefault()
    const checkbox = event.currentTarget
    if (!isInput(checkbox)) {
      throw new Error('expected "input" for bio visibility')
    }
    const visibility = checkbox.checked
    this.actor.setFlag(scope, 'bio-visibility', visibility)
  }

  private onChangeInputDelta(event: ChangeEvent<HTMLElement>) {
    const input = event.target
    if (!isInput(input)) {
      throw new Error('expected input')
    }
    const { value } = input
    if (value.startsWith('+') || value.startsWith('-')) {
      const delta = parseFloat(value)
      const { name } = input
      if (isIn(this.actor.data, name)) {
        const property = getProperty(this.actor.data, name)
        if (typeof property === 'number') {
          input.value = String(property + delta)
        } else {
          throw new Error('form number input bound to non-numerical data')
        }
      } else {
        throw new Error('form number input bound to non-existent data')
      }
    } else if (value[0] === '=') {
      input.value = value.slice(1)
    }
  }

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      classes: ['sheet', 'actor', 'npc', 'lawful-sheet', 'lawful-merchant'],
    }
  }
}

export default LawfulLootMerchant
