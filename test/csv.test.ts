import { assert, describe, expect, it } from 'vitest'
import { deocdeCSV, encodeCSV } from '../src/csv'

describe('deocdeCSV', () => {
  it('throws on invalid grammer', () => {
    assert.throws(() => {
      deocdeCSV('a,""b,c,\r\n1,2,3,\r\n4,5')
      deocdeCSV('a,"b,c,\r\n1,2,3,\r\n4,5')
      deocdeCSV('a,""b,c",\r\n1,2,3,\r\n4,5')
    })
  })

  it('decodes', () => {
    expect(deocdeCSV('')).toEqual([])

    expect(deocdeCSV(`""""""""`)).toEqual([[`"""`]])

    expect(deocdeCSV('aaa,bbb')).toEqual([['aaa', 'bbb']])

    expect(deocdeCSV('a,b,c\ne,f,g\n')).toEqual([
      ['a', 'b', 'c'],
      ['e', 'f', 'g'],
    ])

    expect(deocdeCSV('a,"b",c,\r\n1,2,3,\r\n4,5')).toEqual([
      ['a', 'b', 'c', ''],
      ['1', '2', '3', ''],
      ['4', '5'],
    ])

    expect(deocdeCSV(`"the ""word"" is true","a ""quoted-field"""`)).toEqual([
      [`the "word" is true`, `a "quoted-field"`],
    ])

    expect(deocdeCSV(`"Multi-line\nfield","comma is ,"`)).toEqual([
      [`Multi-line\nfield`, `comma is ,`],
    ])
  })
})

describe('encodeCSV', () => {
  it('no escape', () => {
    expect(encodeCSV([
      [1, '2', 3],
      ['4', 5, '6'],
    ])).toBe('1,2,3\r\n4,5,6\r\n')
  })

  it('escape', () => {
    expect(encodeCSV([
      ['"', 2, 3],
      [4, 5, 6],
    ])).toBe(`"""",2,3\r\n4,5,6\r\n`)

    expect(encodeCSV([['\r']])).toEqual(`"\r"\r\n`)
  })

  it('identical', () => {
    const identical = (records: unknown[][]) => deocdeCSV(encodeCSV(records))

    expect(identical([['"', 2, 3], [4, 5, 6]]))
      .toEqual([['"', '2', '3'], ['4', '5', '6']])

    expect(identical([['"'], ['\r'], ['\n']]))
      .toEqual([['"'], ['\r'], ['\n']])
  })
})
