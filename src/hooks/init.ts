import * as currency from '../logic/currency'

function onInit() {
  Handlebars.registerHelper('toCurrency', function (price: number) {
    return currency.toString(currency.fromGp(price))
  })
  return loadTemplates([
    'modules/lawful-loot/templates/actors/parts/actor-traits.html',
    'modules/lawful-loot/templates/actors/parts/actor-inventory.html',
    'modules/lawful-loot/templates/apps/multi-transaction.html',
  ])
}

export default onInit
