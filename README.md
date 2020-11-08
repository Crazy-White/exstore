# Exstore

### new Exstore([keyName ,types, isUnique], [...], ...)

The constructor passes in multiple arguments, each of which is an array ([keyName, types, isUnique]), equivalent to ([keyName, '*', false]) if not an array

```javascript
const storage = new Exstore(['id', 'number', false], name, info);
```

### setItem(...val)

Set one item

```javascript
storage.setItem(1, 'Peter', 'empty...');
storage.setItem(2, 'Shelly', 'wow...');
```

### getItem(key, val)

If there are multiple, only the first one is returned

```javascript
storage.getItem(id, 2); // => [2, 'Shelly', 'wow...']
```

### insert(...args)

Set many items

```javascript
storage.insert([3, '???', '...'], [4, '!!!', '...']);
```

### toObject()

### toString()

### \_objectify()

### \_source

### \_template

### \$template
