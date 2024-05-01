# listore

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href] [![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

_Store data without defining key names multiple times_

```ts
interface Pet {
  species: string
  name: string
  age: number
}

const list = new Listore<Pet>(['species', 'name', 'age'])

list.push(['cat', 'Fluffy', 4])
list.push(['dog', 'Spot', 7])
list.push(['cat', 'Mittens', 2])

const objects = list.toObjects()
/**
 * [
 *  { species: 'cat', name: 'Fluffy',  age: 4 },
 *  { species: 'dog', name: 'Spot',    age: 7 },
 *  { species: 'cat', name: 'Mittens', age: 2 },
 * ]
 */

const csv = list.toCSV()
/**
 * species,name,age
 * cat,Fluffy,4
 * dog,Spot,7
 * cat,Mittens,2
 */

// or construct Listore from xxx
Listore.fromCSV(csv)
Listore.fromObjects(objects)
```

_features_

- Easy to use, just like built-in Array
- Self contained, ZERO dependency
- Supports wide range of formats
  - CSV (in, out)
  - HTML table (out)
  - HTMLTableElement (in)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/listore?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/listore
[npm-downloads-src]: https://img.shields.io/npm/dm/listore?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/listore
[bundle-src]: https://img.shields.io/bundlephobia/minzip/listore?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=listore
[license-src]: https://img.shields.io/github/license/YieldRay/listore.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/YieldRay/listore/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/listore
