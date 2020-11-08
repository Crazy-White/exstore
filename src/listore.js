class Listore {
    constructor(...template) {
        this._template = template.map(e => {
            if (typeof e[0] !== 'string') throw new Error('keyName must be string');
            if (Array.isArray(e)) return [e[0], e[1] || '*', Boolean(e[2])];
            else return [e, '*', false];
        });
        this.$template = this._template.map(e => e[0]);
        this._source = [];
    }
    _objectify(arr) {
        // arr is a single Array
        const obj = {};
        for (let i = 0, len = arr.length; i < len; i++) {
            this.$template.forEach(key => (obj[key] = arr[i]));
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
    setItem(...args) {
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
        this._source.push(arr);
        return true;
    }
    insert(...args) {
        args.forEach(e => this.setItem(...e));
    }
    toObject = () => this._source.map(this._objectify.bind(this));
    toString = () => JSON.stringify(this._source.map(this._objectify.bind(this)));
}

export default Listore;
