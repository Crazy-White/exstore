import { assert, describe, expect, it } from 'vitest'
import { parseCSV } from '../src/csv'

describe('parseCSV', () => {
  it('invalid grammer', () => {
    assert.throws(() => {
      parseCSV('a,""b,c,\r\n1,2,3,\r\n4,5', true)
      parseCSV('a,"b,c,\r\n1,2,3,\r\n4,5', true)
      parseCSV('a,""b,c",\r\n1,2,3,\r\n4,5', true)
    })
  })

  it('parse header', () => {
    expect(parseCSV('', true)).toEqual({
      header: [],
      records: [],
    })

    expect(parseCSV('a,"b",c,\r\n1,2,3,\r\n4,5', true)).toEqual({
      header: ['a', 'b', 'c', ''],
      records: [['1', '2', '3', ''], ['4', '5']],
    })

    expect(parseCSV('a,"b,c,"\r\n1,2,3,\r\n4,5', true)).toEqual({
      header: ['a', 'b,c,'],
      records: [['1', '2', '3', ''], ['4', '5']],
    })
  })

  it('without header', () => {
    expect(parseCSV('')).toEqual({
      header: [],
      records: [],
    })

    expect(parseCSV('a,"b",c,\r\n1,2,3,\r\n4,5')).toEqual({
      header: [],
      records: [['a', 'b', 'c', ''], ['1', '2', '3', ''], ['4', '5']],
    })
  })

  it('custom header', () => {
    expect(parseCSV('', ['aaa', 'bbb'])).toEqual({
      header: ['aaa', 'bbb'],
      records: [],
    })
  })
})
