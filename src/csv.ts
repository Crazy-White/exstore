/**
 ABNF grammar
 ```abnf
  file = [header CRLF] record *(CRLF record) [CRLF]
  header = name *(COMMA name)
  record = field *(COMMA field)
  name = field
  field = (escaped / non-escaped)
  escaped = DQUOTE *(TEXTDATA / COMMA / CR / LF / 2DQUOTE) DQUOTE
  ```
  this is a loose parse, so we allow `( CR / LF ) +` as a record separator
  @rfc https://www.rfc-editor.org/rfc/rfc4180#section-2
 */
export function deocdeCSV(
  csv: string,
): string[][] {
  let index = 0

  // consume field but not consume the trailing quote
  const consumeField = () => {
    const left = index
    if (csv[index] !== '"') { // no escaping
      while (index < csv.length) {
        if (
          csv[index] === ','
          || csv[index] === '\r'
          || csv[index] === '\n'
        )
          return csv.slice(left, index)
        else index++
      }

      return csv.slice(left, index)
    }

    index++ // skip left quote
    let field = ''

    while (index < csv.length) {
      if (csv[index] === '"') {
        // ,"..."
        if (index + 1 >= csv.length) {
          index++
          return field
        }

        //  ,"...", | ,"..."\r | ,"..."\n
        if (
          csv[index + 1] === ','
          || csv[index + 1] === '\r'
          || csv[index + 1] === '\n'
        ) {
          index++ // skip right quote
          return field
        }

        // ,"...""
        if (csv[index + 1] === '"') {
          index += 2
          field += '"'
          continue
        }

        // end of field
        index++
        return field
      }
      else {
        // ,"...x
        field += csv[index++]
      }
    }

    throw new Error(`Unexpected end of CSV field begin at position ${left}`)
  }

  const consumeRecord = () => {
    const record: string[] = []

    while (index < csv.length) {
      record.push(consumeField())
      if (csv[index] === ',') {
        if ((++index) === csv.length) { // comma at the end of csv
          record.push('')
          break
        }
        else { // comsume next field
          continue
        }
      }
      else {
        if (index >= csv.length)
          break
        if (csv[index] !== '\r' && csv[index] !== '\n')
          throw new Error(`Unexpected end of CSV record at position ${index}`)

        // reach record end
        while (
          index < csv.length && (csv[index] === '\r' || csv[index] === '\n')
        ) index++ // skip record separator
        break
      }
    }
    // reach csv end
    return record
  }

  // parse records
  const records: string[][] = []

  while (index < csv.length)
    records.push(consumeRecord())

  return records
}

export function encodeCSV(records: unknown[][]) {
  let csv = ''

  for (const record of records) {
    for (let i = 0; i < record.length; i++) {
      let field = String(record[i])

      let shouldEscape = false

      if (field.includes('"')) {
        shouldEscape = true
        field = field.replace(/"/g, '""')
      }

      if (
        field.includes(',')
        || field.includes('\r')
        || field.includes('\n')
      )
        shouldEscape = true

      if (shouldEscape)
        field = `"${field}"`

      if (i + 1 < record.length)
        field += ','

      csv += field
    }
    csv += '\r\n'
  }

  return csv
}
