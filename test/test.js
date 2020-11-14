const Listore = require('./dist/listore.cjs.js');
var a = new Listore(['id', 'number', true], ['key', 'string|number'], ['name', 'string|number']);
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
var b = new Listore('x', 'y', 'z');
b.setItem([0, 0, 0]);
b.setItem([1, 1, 1]);
b.setItem([2, 2, 2]);
b.setItem([2, 2, 2]);
Listore.from(a.toObject());
