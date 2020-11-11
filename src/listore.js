const $source = Symbol('source array');
const $template = Symbol('complied template');
const $tpl = Symbol('string template');

/** Class Listore */
class Listore {
    [$source] = [];
    /**
     * Generate an instance of Listorr
     * @param {array} template - The template for values.
     */
    constructor(...template) {
        this[$template] = template.map(e => {
            if (typeof e[0] !== 'string') throw new Error('keyName must be string');
            if (Array.isArray(e)) return [e[0], e[1] || '*', Boolean(e[2])];
            else return [e, '*', false];
        });
        this[$tpl] = this[$template].map(e => e[0]);
        if (new Set(this[$tpl]).size !== this[$tpl].length) throw new Error('keyName cannot be the same');
    }

    /**
     * Convert data into an object.
     * @param {array} arr - An array which fit the template.
     * @return {object} The transformed object.
     */
    objectify(arr) {
        // arr is a single array
        const obj = {};
        for (let i = 0, len = arr.length; i < len; i++) obj[this[$tpl][i]] = arr[i];
        return obj;
    }

    /**
     * Converts an object to an array
     * @param {object} obj - An object which fit the template.
     * @return {array} The transformed array.
     */
    arrayify(obj) {
        const t = this[$tpl],
            len = t.length,
            arr = Array.of(len).fill(null);
        for (let i = 0; i < len; i++) arr[i] = obj[t[i]];
        return arr;
    }

    /**
     * Gets the position of a data
     * @param {string|number} k - The keyName or the index of the template
     * @param {*} v - The value which we want it equal to
     * @param {number} p - The starting position
     * @return {number} The position.
     */
    position(k, v, p = 0) {
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

    /**
     * Modify data
     * @param {array|object} values - The value to be converted
     * @return {array} The data which fit the template.
     */
    modify(values) {
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

    /**
     * Reset a data
     * @param {number} pos - The position of the target data
     * @param {array} newValues - The new data
     * @return {boolean} if success
     */
    resetItem(pos, newValues) {
        const newVal = this.modify(newValues);
        this[$source][pos] = newVal;
        return true;
    }

    /**
     * Gets a wanted data
     * @param {string} k - The keyName
     * @param {*} v - The value which we want it equal to
     * @param {number} p - The starting position
     * @return {array} The wanted data.
     */
    getItem(k, v, p = 0) {
        const pos = this.position(k, v, p);
        if (pos < 0) return null;
        return clone(this[$source][pos]);
    }

    /**
     * Set a new data
     * @param {array|object} values - The value to be set, which must fit the template
     * @return {boolean} If success
     */
    setItem(values) {
        try {
            this[$source].push(this.modify(values));
            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Insert a data by position
     * @param {number} pos - The position of the before data
     * @param {array|object} values - The new data
     * @return {boolean} if success
     */
    insert(pos, values) {
        if (pos > this[$source].length - 1) return false;
        this[$source].splice(pos, 0, this.modify(values));
        return true;
    }

    /**
     * Deleta a data by position
     * @param {number} pos - The position of the target data
     * @return {boolean} if success
     */
    delete(pos) {
        if (pos > this[$source].length - 1) return -1;
        this[$source].splice(pos, 1);
        return true;
    }

    /**
     * Reverse all data
     * @return {array} raw data
     */
    reverse = () => this[$source].reverse() && this.source;

    /**
     * Sort all data
     * @param {function} f - The handler function
     * @return {array} raw data
     */
    sort = f => this[$source].sort(f) && this.source;

    /** @member {array} */
    get template() {
        return clone(this[$template]);
    }

    /** @member {array} */
    get source() {
        return clone(this[$source]);
    }

    /**
     * Set many data from a array
     * @param {array} objs - An array contains many objects or arrays, which must fit the template
     * @return {undefind}
     */
    from = objs => objs.forEach(e => this.setItem(this.modify(e)));

    /**
     * Convert whole data into an array which contain objects.
     * @return {array} The wanted array, which is useful for searching.
     */
    toObject = () => this[$source].map(this.objectify.bind(this));
    toString = () => JSON.stringify(this.toObject());
    toJSON = () => this.source;

    /**
     * clone function by npm package clone v2.1.2
     * @return {*}
     * @static
     */
    static clone = (...args) => clone(...args);
}

export default Listore;
