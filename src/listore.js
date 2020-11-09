class Listore {
    constructor(...template) {
        this._template = template.map(e => {
            if (typeof e[0] !== 'string') throw new Error('keyName must be string');
            if (Array.isArray(e)) return [e[0], e[1] || '*', Boolean(e[2])];
            else return [e, '*', false];
        });
        this.$template = this._template.map(e => e[0]);
        if (new Set(this.$template).size !== this.$template.length) throw new Error('keyName cannot be the same');
        this._source = [];
    }
    _objectify(arr) {
        // arr is a single array
        const obj = {};
        for (let i = 0, len = arr.length; i < len; i++) {
            // for single data
            obj[this.$template[i]] = arr[i];
        }
        return obj;
    }
    getItem(k, v) {
        if (!v) throw new Error('This function has two params');
        let fin = null;
        const index = typeof k === 'number' ? k : this.$template.indexOf(k);
        if (index < 0) return null;
        for (let i = 0, len = this._source.length; i < len; i++) {
            const out = this._source[i][index];
            if (out === v) {
                fin = this._source[i];
                break;
            }
        }
        return fin;
    }
    _modify(...args) {
        const arr = Array(this.$template.length).fill(null);
        for (let i = 0, len = args.length; i < len; i++) {
            const data = args[i];
            const [keyName, types, isUnique] = this._template[i];
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
        return arr;
    }
    setItem(...args) {
        try {
            this._source.push(this._modify(...args));
            return true;
        } catch (err) {
            return false;
        }
    }
    // methods below will change the raw _source
    // otherwise it will not be included
    // use toObject function can make search easier
    insert = (locator, data) => {
        // add another element after one
        // locator is a reference to a known element
        // data: args in setItem(...args), is an array
        const place = typeof locator === 'number' ? locator : this._source.indexOf(locator);
        if (place < 0) return false;
        this._source.splice(place, 0, this._modify(...data));
        return true;
    };
    delete = locator => {
        // e.g. storage.delete(storage.getItem(...args))
        const place = typeof locator === 'number' ? locator : this._source.indexOf(locator);
        if (place < 0) return false;
        this._source.splice(place, 1);
        return true;
    };
    reverse = () => this._source.reverse();
    sort = func => this._source.sort(func);
    // util
    toObject = () => this._source.map(this._objectify.bind(this));
    toString = () => JSON.stringify(this._source.map(this._objectify.bind(this)));
}

export default Listore;
