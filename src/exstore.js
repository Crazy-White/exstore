class Exstore {
    constructor(...template) {
        this._template = template;
        this.$template = template.map(e => (Array.isArray(e) ? e[0] : e));
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
        if (!v) throw new Error('this function has two params');
        let fin = null;
        const index = this.$template.indexOf(k);
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
        const arr = [];
        for (let i = 0, len = args.length; i < len; i++) {
            const data = args[i];  // TODO: type handler
            if (Array.isArray(this._template) && this._template[1]) {
                if (this.getItem(this.$template[i], data)) throw new Error('Already exist');
                else arr.push(data);
            }
        }
        this._source.push(arr);
        return true;
    }
    insert(...args) {
        args.forEach(e => this.setItem(...e));
    }
    toObject = () => this._source.map(this._objectify.bind(this));
    toString = () => JSON.stringify(this._source.map(this._objectify));
}

export default Exstore;
