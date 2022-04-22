# Listore

[![](https://badgen.net/packagephobia/install/listore)](https://packagephobia.com/result?p=listore)
![version](https://img.shields.io/npm/v/listore)
![license](https://img.shields.io/npm/l/listore)
![download](https://img.shields.io/npm/dt/listore)

Store data without defining key names multiple times.

```js
import Listore from 'listore';
const tpl = ['name', 'price'];
const tplWithCheck = [
    {
        key: 'name',
        type: 'string',
    },
    {
        key: 'price',
        type: 'number',
        check: value => value > 0,
    },
];
const listore = new Listore(tplWithCheck); // or simply new Listore(tpl)
listore.insert('item1', 10); // => 1 for success 0 for fail
listore.insert(['item2', 20], ['item3', 30]); // => 2 for success, returns amount of inserted items
console.log(listore.toObject());
//[
//  { name: 'item1', price: 10 },
//  { name: 'item2', price: 20 },
//  { name: 'item3', price: 30 }
//]
```

_Notice_: The 0.x.x version is extremely unstable. Please specify the version number when using

## Installation

```sh
$ npm i listore
```

## Documentation

<https://listore.js.org/classes/default.html>
