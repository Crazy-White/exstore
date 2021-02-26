# Listore

[![](https://badgen.net/packagephobia/install/listore)](https://packagephobia.com/result?p=listore)
![version](https://img.shields.io/npm/v/listore)
![license](https://img.shields.io/npm/l/listore)
![download](https://img.shields.io/npm/dt/listore)

Store data without defining key names multiple times.

```js
const storage = new Listore(['id', 'name', 'info']);
storage.setItem([0, 'test1', 'no desciption']);
storage.setItem([1, 'test2', 'no desciption']);
storage.toObject(); // => [{ id: 0, name: 'test1', info: 'no desciption' }, { id: 1, name: 'test2', info: 'no desciption' }]
```

_Notice_: The 0.x.x version is extremely unstable. Please specify the version number when using

## Installation

```sh
$ npm i listore
```

## Documentation

<https://listore.js.org/Listore.html>
