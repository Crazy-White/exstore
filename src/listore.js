import clone from './clone.js';
const $source = Symbol('source array');
const $template = Symbol('complied template');
const $tpl = Symbol('string template');
class Listore {
    [$source] = [];
    constructor(...template) {
        this[$template] = template.map(e => {
            if (typeof e[0] !== 'string') throw new Error('keyName must be string');
            if (Array.isArray(e)) return [e[0], e[1] || '*', Boolean(e[2])];
            else return [e, '*', false];
        });
        this[$tpl] = this[$template].map(e => e[0]);
        if (new Set(this[$tpl]).size !== this[$tpl].length) throw new Error('keyName cannot be the same');
    }
    _objectify(arr) {
        // arr is a single array
        const obj = {};
        for (let i = 0, len = arr.length; i < len; i++) {
            // for single data
            obj[this[$tpl][i]] = arr[i];
        }
        return obj;
    }
    getItem(k, v) {
        if (!v) throw new Error('This function has two params');
        let fin = null;
        const index = typeof k === 'number' ? k : this[$tpl].indexOf(k);
        if (index < 0) return null;
        for (let i = 0, len = this[$source].length; i < len; i++) {
            const out = this[$source][i][index];
            if (out === v) {
                fin = this[$source][i];
                break;
            }
        }
        return fin;
    }
    _modify(values) {
        const arr = Array(this[$tpl].length).fill(null);
        for (let i = 0, len = values.length; i < len; i++) {
            const data = values[i];
            const [keyName, types, isUnique] = this[$template][i];
            let flag = false;
            if (types.includes('*')) {
                flag = true;
            } else {
                // handler the string command, TODO: filter the wrong command
                types
                    .replace(' ', '')
                    .toLowerCase()
                    .split('|')
                    .forEach(e => (typeof data === e ? (flag = true) : ''));
            }
            if (flag) {
                if (this.getItem(keyName, data)) throw new Error('Key already exists');
                else arr[i] = data;
            } else {
                throw new Error('This type of input is not allowed');
            }
        }
        return clone(arr);
    }
    setItem(values) {
        try {
            this[$source].push(this._modify(values));
            return true;
        } catch (err) {
            return false;
        }
    }
    // methods below will change the raw _source
    // otherwise it will not be included
    // use toObject function can make search easier
    insert = (locator, values) => {
        // add another element after one
        // locator is a reference to a known element
        // data: args in setItem(args), is an array
        const place = typeof locator === 'number' ? locator : this[$source].indexOf(locator);
        if (place < 0) return false;
        this[$source].splice(place, 0, this._modify(values));
        return true;
    };
    delete = locator => {
        // e.g. storage.delete(storage.getItem(...args))
        const place = typeof locator === 'number' ? locator : this[$source].indexOf(locator);
        if (place < 0) return false;
        this[$source].splice(place, 1);
        return true;
    };
    reverse = () => this[$source].reverse();
    sort = f => this[$source].sort(f);
    // output
    get template() {
        return clone(this[$template]);
    }
    // util
    toObject = () => this[$source].map(this._objectify.bind(this));
    toJSON = () => JSON.stringify(this.toObject());
    toString = () => this.toJSON();
    static clone = (...args) => clone(...args);
}

export default Listore;
