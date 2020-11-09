const Listore = require('./dist/listore.umd.js');
a = new Listore(['id', 'number', 'true'], ['key', 'string|number'], ['name', 'string|number']);
f = () => {
    [
        [1, 'a', 'hello'],
        [2, 'b', 'world'],
    ].forEach(e => a.setItem(...e));
};
f();
while (false) {
    console.log(a.delete(0));
}
console.log(a.toObject());
f();
console.log(a.reverse());
console.log(a.reverse());
console.log(a.reverse());
console.log(a.sort());
a.setItem(...[3, 'c', '!']);
