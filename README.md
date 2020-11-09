# Listore

Store some data line by line  
Using this library, it is recommended that you store something that could be stringified.

### new Listore([keyName ,types, isUnique], [...], ...)

The constructor passes in multiple arguments, each of which is an array ([keyName, types, isUnique]), equivalent to ([keyName, '*', false]) if not an array

```javascript
const storage = new Listore(['id', 'number', false], name, info);
```

### setItem(...val)

Set one item

```javascript
storage.setItem(1, 'Peter', 'empty...'); // => true
storage.setItem(2, 'Shelly', 'wow...'); // => true
```

### getItem(key, val)

If there are multiple, only the first one is returned

```javascript
storage.getItem(id, 2); // => [2, 'Shelly', 'wow...']
```

### insert(locator, args)

```javascript
storage.insert(storage.getItem(id, 1), [3, 'John', 'cool...']); // => true
```

### delete(locator)

```javascript
storage.delete(storage.getItem(...args)); // => true
```

### reverse()

### sort(func)

### toObject()

### toString()

### \_objectify()

### \_modify()

### \_source

### \_template

### \$template
