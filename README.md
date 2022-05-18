# Listore

[![](https://badgen.net/packagephobia/install/listore)](https://packagephobia.com/result?p=listore)
![version](https://img.shields.io/npm/v/listore)
![license](https://img.shields.io/npm/l/listore)
![download](https://img.shields.io/npm/dt/listore)

Store data without defining key names multiple times.  
Ships a similar API with vue's prop validator

```js
import Listore from 'listore';
const props = ['name', 'price'];
const propValidator = {
    // only things that is not undefined will be checked by type and validator
    // default value will also be checked
    name: [String, Number],
    price: {
        type: Number, // or [String, Number]
        default: 0,
        validator: value => value >= 0,
        required: true, // required means undefined is not allow
    },
};

const listore = new Listore(propValidator); // or simply new Listore(props)
listore.insertOne(['item1', undefined]); // => 1 for success and 0 for fail, fill undefined for using default value (if set)
// or listore.insertOne(['item1']);
listore.insert(['item2', 20], ['item3', 30]); // => 2 for success, returns the amount of inserted items
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
