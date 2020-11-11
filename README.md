# Listore

Store some data as a list.
Using this library, it is recommended that you store something that could be stringified.

### new Listore([keyName ,types, isUnique], [...], ...)

The constructor passes in multiple arguments, each of which is an array ([keyName, types, isUnique]), equivalent to ([keyName, '*', false]) if not an array

```javascript
const storage = new Listore(['id', 'number', false], name, info);
```

### Liststore.clone

a clone function from _npm package clone v2.1.2_
<https://www.npmjs.com/package/clone>

### setItem(values)

Set one item

```javascript
storage.setItem([1, 'Peter', 'empty...']); // => true
storage.setItem([2, 'Shelly', 'wow...']); // => true
```

### resetItem(pos, newValues)

### getItem(key, val, start = 0)

If there are multiple, only the first one is returned

```javascript
storage.getItem(id, 2); // => [2, 'Shelly', 'wow...']
```

### position(k, v, start = 0)

### insert(pos, values)

```javascript
storage.insert(0, [3, 'John', 'cool...']); // => true
```

### delete(pos)

```javascript
storage.delete(0); // => true
```

### reverse()

### sort(func)

### toObject()

### toString()

### \objectify(arr)

### \arrayify(obj)

### \modify(arr|obj)

### template

### source
