export function tableTBString(records: unknown[][], header?: unknown[]) {
  let s = '<table>\r\n'

  if (header) {
    s += '  <thead>\r\n    <tr>\r\n'
    for (const field of header)
      s += `      <th scope="col">${escape(String(field))}</th>\r\n`

    s += '    </tr>\r\n  </thead>\r\n'
  }

  s += '  <tbody>\r\n'
  for (const record of records) {
    s += '    <tr>\r\n'
    for (const field of record)
      s += `      <td>${escape(String(field))}</td>\r\n`

    s += '    </tr>\r\n'
  }

  s += '  </tbody>\r\n</table>'

  return s
}

export function tableLRString(records: unknown[][], header?: unknown[]) {
  let s = '<table>\r\n'

  for (let i = 0; i < records.length; i++) {
    s += '  <tr>\r\n'

    if (header)
      s += `    <th scope="row">${escape(String(header[i]))}</th>\r\n`

    for (const record of records)
      s += `    <td>${escape(String(record[i]))}</td>\r\n`
  }

  s += '  </tr>\r\n</table>'

  return s
}

/** Escape a string for safe usage in HTML. */
function escape(str: string): string {
  return str.replaceAll(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`)
}
