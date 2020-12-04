const noError = f => {
    try {
        f();
    } catch (err) {
        console.info('ERROR: ' + err.message);
    }
};
const Listore = require('../dist/listore.js');
let a = new Listore([{ key: 'id', check: [], isUnique: false }, 'key', 'name'], {
    onset: (storage, item, fn) => console.log(`New item: ${JSON.stringify(item)} is set by function "${fn}"`),
});
let f = () => {
    [
        [1, 'a', 'hello'],
        [2, 'b', 'world'],
    ].forEach(e => a.setItem(e));
};
f();
let i = false;
while (!i) {
    i = a.delete(0);
}
console.log(a.toObject());
f();
console.log(a.reverse());
console.log(a.sort());
a.setItem([3, 'c', '!']);
let b = new Listore(['x', 'y', 'z']);
b.setItem([0, 0, 0]);
b.setItem([1, 1, 1]);
b.setItem([2, 2, 2]);
b.setItem([2, 2, 2]);
Listore.from(a.toObject());

let isString = e => typeof e === 'string';
let isNumber = e => typeof e === 'number';
const storage = new Listore(
    [
        { key: 'name', isUique: false, fmt: e => e.trim(), check: [isString, e => e.length > 1] },
        { key: 'id', isUique: true, check: [isNumber] },
        'info',
        'note',
    ],
    {
        onset: (storage, item, fn) => console.log(`New item: ${JSON.stringify(item)} is set by function "${fn}"`),
        ondelete: (storage, item, fn) => null, // anything you want to do
    },
);
storage.setItem(['testName  ', 0, 'abc', '...']);
noError(() => storage.setItem(['testName  ', 0, 'abc', '...']));
noError(() => storage.setItem(['testName2', 1, 'abc', '...']));
noError(() => storage.setItem(['    a    ', 2, 'abc', '...']));
