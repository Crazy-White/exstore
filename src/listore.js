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
    objectify(arr) {
        // arr is a single array
        const obj = {};
        for (let i = 0, len = arr.length; i < len; i++) obj[this[$tpl][i]] = arr[i];
        return obj;
    }
    arrayify(obj) {
        const t = this[$tpl],
            len = t.length,
            arr = Array.of(len).fill(null);
        for (let i = 0; i < len; i++) arr[i] = obj[t[i]];
        return arr;
    }
    position(k, v, p = 0) {
        // Index|KeyName: k
        if (p > this[$source].length - 1) return -1;
        const index = typeof k === 'number' ? k : this[$tpl].indexOf(k);
        if (index < 0) return -1;
        for (let i = p, len = this[$source].length; i < len; i++) {
            if (this[$source][i][index] === v) {
                return i;
            }
        }
        return -1;
    }
    modify(values) {
        // Array|Object: values  return Array
        values = Array.isArray(values) ? values : this.arrayify(values);
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
    resetItem(pos, newValues) {
        const refer = this[$source][pos];
        const newVal = this.modify(newValues);
        refer = newVal;
        return true;
    }
    getItem(k, v, p = 0) {
        const pos = this.position(k, v, p);
        if (pos < 0) return null;
        return clone(this[$source][pos]);
    }
    setItem(values) {
        try {
            this[$source].push(this.modify(values));
            return true;
        } catch (err) {
            return false;
        }
    }
    // methods below will change the raw _source
    // otherwise it will not be included
    // use toObject function can make search easier
    insert = (pos, values) => {
        // add another element after one
        // locator is a reference to a known element
        // data: args in setItem(args), is an array
        if (pos > this[$source].length - 1) return false;
        this[$source].splice(pos, 0, this.modify(values));
        return true;
    };
    delete = pos => {
        if (pos > this[$source].length - 1) return -1;
        this[$source].splice(pos, 1);
        return true;
    };
    reverse = () => this[$source].reverse();
    sort = f => this[$source].sort(f);
    // output
    get template() {
        return clone(this[$template]);
    }
    get source() {
        return clone(this[$source]);
    }
    // util
    toObject = () => this[$source].map(this.objectify.bind(this));
    toString = () => JSON.stringify(this.toObject());
    toJSON = () => this.source;
    static clone = (...args) => clone(...args);
}

export default Listore;
