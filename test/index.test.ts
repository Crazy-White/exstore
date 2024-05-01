import { describe, expect, it } from 'vitest'
import { Listore } from '../src/index'

describe('listore', () => {
  it('has array api', () => {
    const listore = new Listore<{
      c1: string
      c2: number
      c3: string
    }>(['c1', 'c2', 'c3'])

    expect(listore).instanceOf(Array)

    expect(Array.isArray(listore)).toBe(true)

    listore.push(['1', 2, '3'])

    expect(listore.toCSV()).toEqual(`c1,c2,c3\r\n1,2,3\r\n`)
    expect(listore.toObjects()).toEqual([{ c1: '1', c2: 2, c3: '3' }])

    listore.importObjects([{ c1: 6, c2: 6, c3: 6 }])
    expect(listore.toCSV()).toEqual(`c1,c2,c3\r\n1,2,3\r\n6,6,6\r\n`)
    expect(listore.toObjects()).toEqual([
      { c1: '1', c2: 2, c3: '3' },
      { c1: 6, c2: 6, c3: 6 },
    ])
  })
})
