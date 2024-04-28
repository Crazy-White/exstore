// plan to support https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator
export class Listore<T extends { [key: keyof any]: any }> extends Array {
  columns: Array<keyof T>
  entires: Array<T[keyof T]> = []
  constructor(columns: (keyof T)[]) {
    super()
    this.columns = columns
  }

  importObject(object: object) {
    this.entires.push(...Object.values(object))
  }

  fromObject(object: object) {
    this.entires = Object.values(object)
  }

  static fromObject() {}

  fromTable() {}

  static fromCSV() {}

  importTable() {}
}
