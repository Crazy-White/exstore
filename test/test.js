const noError = f => {
    try {
        f();
    } catch (err) {
        console.info('ERROR: ' + err.message);
    }
};
const Listore = require('../dist/listore.js');

const isString = e => typeof e === 'string';
const isNumber = e => typeof e === 'number';
const tpl = [
    { key: 'name', isUique: false, fmt: e => e.trim(), check: [isString, e => e.length > 1] },
    { key: 'id', isUique: false, check: [isNumber], default: -1 },
    'info',
    'note',
];
const onoperate = (storage, item, fn) => console.log(`New item: ${JSON.stringify(item)} is set by function "${fn}"`);
const storage = new Listore(tpl, onoperate);
storage.setItem(['key', 0, 'info', 'note']);
storage.setItem(['key', 'not a number', 'info', 'note']);
storage.insert(1, ['insert', 1, 'info', 'note']);
console.log(storage.toObject());
console.log(String(storage));
