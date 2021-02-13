import { create, isLessThan, normalize, subtract } from './currency'

describe('currency', () => {
  describe('subtract', () => {
    it.each([
      [create(), create(), create()],
      [create({ gp: 10 }), create({ gp: 5 }), create({ gp: 5 })],
      [create({ gp: 10 }), create({ gp: 5, sp: 3 }), create({ gp: 4, ep: 1, sp: 2 })],
    ])(
      '%s from %s = %s',
      (left: Currency, right: Currency, expected: Currency) => {
        const actual = subtract(left, right)
        assertEqual(actual, expected)
      },
    )
  })

  describe('isLessThan', () => {
    it.each([
      [create(), create(), false],
      [create({ gp: 10 }), create({ gp: 5 }), false],
      [create({ gp: 2, sp: 30 }), create({ gp: 5 }), false],
      [create({ gp: 2, sp: 29 }), create({ gp: 5 }), true],
      [create({ gp: 2, sp: 31 }), create({ gp: 5 }), false],
    ])(
      '%s from %s = %s',
      (left: Currency, right: Currency, expected: boolean) => {
        const actual = isLessThan(left, right)
        expect(actual).toStrictEqual(expected)
      },
    )
  })

  describe('normalize', () => {
    it.each([
      [create(), create()],
      [create({ gp: 10 }), create({ pp: 1 })],
      [create({ gp: 25 }), create({ gp: 5, pp: 2 })],
      [create({ gp: 19, sp: 11 }), create({ sp: 1, pp: 2 })],
      [create({ gp: 19, sp: 9, cp: 22 }), create({ cp: 2, sp: 1, pp: 2 })],
    ])('normalize(%s) = %s', (left: Currency, expected: Currency) => {
      const actual = normalize(left)
      assertEqual(actual, expected)
    })
  })

  function assertEqual(left: Currency, right: Currency) {
    expect(left.cp).toStrictEqual(right.cp)
    expect(left.sp).toStrictEqual(right.sp)
    expect(left.ep).toStrictEqual(right.ep)
    expect(left.gp).toStrictEqual(right.gp)
    expect(left.pp).toStrictEqual(right.pp)
  }
})
