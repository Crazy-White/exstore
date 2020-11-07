# Exstore

### new Exstore([keyName, isUnique, type], [...], ...)

The constructor passes in multiple arguments, each of which is an array ([keyName, isUnique, Type]), equivalent to ([keyName]) if not an array

```javascript
const storage = new Exstore(['id', false, 'number'], name, info);
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

### insert()

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
