import * as CSV from './csv'
import * as HTMLTable from './html_table'

// plan to support https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator
export class Listore<T extends object> extends Array<T[keyof T][]> {
  constructor(
    private columns: Array<(keyof T)>,
      records: Array<T[keyof T][]> = [],
  ) {
    super()
    this.push(...records)
  }

  toObjects(): T[] {
    const objects: T[] = []

    for (const record of this) {
      const entires: Array<[keyof T, T[keyof T]]> = []
      for (let i = 0; i < this.columns.length; i++)
        entires.push([this.columns[i], record[i]])

      objects.push(Object.fromEntries(entires) as T)
    }

    return objects
  }

  toJSON() {
    return JSON.stringify(this.toObjects())
  }

  toCSV() {
    return CSV.encodeCSV([this.columns, ...this])
  }

  static importObjects(objects: object[]) {
    return objects.map(Object.values)
  }

  static fromObjects<T extends object>(
    columns: Array<(keyof T)>,
    objects: object[],
  ) {
    return new Listore(columns, Listore.importObjects(objects))
  }

  importObjects(objects: object[]) {
    this.push(...Listore.importObjects(objects))
  }

  fromObjects(objects: object[]) {
    this.splice(0, this.length, ...Listore.importObjects(objects))
  }

  static importCSV(csvNoHeader: string): any[][] {
    return CSV.deocdeCSV(csvNoHeader)
  }

  /**
   * omit header line when includeHeader set to true
   */
  importCSV(csv: string, includeHeader = false) {
    let records = Listore.importCSV(csv)
    if (includeHeader)
      [, ...records] = records
    this.push(...records)
  }

  fromCSV(csv: string, includeHeader = false) {
    let records = Listore.importCSV(csv)
    if (includeHeader)
      [, ...records] = records
    this.splice(0, this.length, ...records)
  }

  static fromCSV(csv: string, header?: string[]) {
    let records = Listore.importCSV(csv)
    if (!header)
      [header, ...records] = records
    return new Listore(header, records)
  }

  toHTMLTable(direction: 'tb' | 'lr' = 'tb') {
    if (direction === 'lr')
      return HTMLTable.tableLRString(this, this.columns)
    else return HTMLTable.tableTBString(this, this.columns)
  }
}
