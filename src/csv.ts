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
export function parseCSV(
  csv: string,
  headers: string[] | boolean = false,
) {
  let csvHeader: string[] = Array.isArray(headers) ? headers : []

  let index = 0

  // consume field but not consume the quote
  const consumeField = () => {
    const left = index
    if (csv[index] !== '"') { // no escaping
      while (index < csv.length) {
        if (csv[index] === ',' || csv[index] === '\r' || csv[index] === '\n')
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
        if (index + 1 >= csv.length)
          return field

        //  ,"...", | ,"..."\r | ,"..."\n
        if (
          csv[index + 1] === ',' || csv[index + 1] === '\r'
          || csv[index + 1] === '\n'
        ) {
          index += 1
          return field
        }

        // ,"...""
        if (csv[index + 1] === '"') {
          index += 2
          field += '"'
          continue
        }

        throw new Error(`Unexpect \`"\` at position ${index}`)
      }
      else {
        // ,"...x
        field += csv[index++]
      }
    }

    throw new Error(`Unexpected end of CSV begin at position ${left}`)
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
        // reach record end
        while (
          index < csv.length && (csv[index] === '\r' || csv[index] === '\n')
        ) index++ // skip record separator
        return record
      }
    }
    // reach csv end
    return record
  }

  // parse records
  const records: string[][] = []

  if (headers === true)
    csvHeader = consumeRecord()

  while (index < csv.length)
    records.push(consumeRecord())

  return { header: csvHeader, records }
}
