const Listore = require('../dist/listore.js');
var a = new Listore([{ key: 'id', check: [], isUnique: false }, 'key', 'name'], {
    onset: (storage, item, fn) => console.log(`New item: ${JSON.stringify(item)} is set by function "${fn}"`),
});
var f = () => {
    [
        [1, 'a', 'hello'],
        [2, 'b', 'world'],
    ].forEach(e => a.setItem(e));
};
f();
var i = false;
while (!i) {
    i = a.delete(0);
}
console.log(a.toObject());
f();
console.log(a.reverse());
console.log(a.sort());
a.setItem([3, 'c', '!']);
var b = new Listore(['x', 'y', 'z']);
b.setItem([0, 0, 0]);
b.setItem([1, 1, 1]);
b.setItem([2, 2, 2]);
b.setItem([2, 2, 2]);
Listore.from(a.toObject());

isString = e => typeof e === 'string';
isNumber = e => typeof e === 'number';
const storage = new Listore(
    [
        { key: 'name', isUique: false, fmt: e => e.trim(), check: [isString, e => e.length > 1] },
        { key: 'id', isUique: false, check: [isNumber] },
        'info',
        'note',
    ],
    {
        onset: (storage, item, fn) => console.log(`New item: ${JSON.stringify(item)} is set by function "${fn}"`),
        ondelete: (storage, item, fn) => null, // anything you want to do
    },
);
