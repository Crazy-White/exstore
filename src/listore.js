import clone from './clone.js';

const $source = Symbol('Source: array');
const $tpl = Symbol('Template: string');

class Listore {
    [$source] = [];
    /**
     * Generate an instance of Listore by a template <br/>
     * As the example shows below, the template contains many arrays(or string), each of which has three elements
     * like [keyName, typeCommand = '*', isUnique = false]. if it is a string, such as 'keyName', equal to ['keyName']. <br/>
     * You can get the template attribute to see the complied array template, such as `storage.template`, changes to this array is no use as it is just a clone. <br/>
     * String::keyName Corresponds to the key name of the object generated when the toObject function is called <br/>
     * String::typeCommand Allowed type, using the Typeof command, so 'array' doesn't work, 'object' allows all instances of object. Allows multiple types to be separated by '|', case insensitive. And '*' indicates that any type is allowed <br/>
     * Boolean::isUnique Whether repetition is allowed. This is useful when you need item to be unique <br/>
     * @param {array} template - The template for item, which corresponds to the Listore's instance function.
     * @example
     * const storage = new Listore(['id', 'number', true], ['name', 'string'], ['info', 'string|number'], 'tips')
     */
    constructor(...template) {
        this.template = template.map(e => {
            if (typeof e[0] !== 'string') throw new Error('keyName must be string');
            if (Array.isArray(e)) return Object.freeze([e[0], e[1] || '*', Boolean(e[2])]);
            else return Object.freeze([e, '*', false]); // ensure each array is freezed
        });
        this[$tpl] = this.template.map(e => e[0]); // keys template
        Object.freeze(this.template);
        Object.freeze(this[$tpl]);
        if (new Set(this[$tpl]).size !== this[$tpl].length) throw new Error('keyName cannot be the same');
    }

    /**
     * Convert an item into an object
     * @param {array} arr - An array(item array) which fit the template
     * @return {object} The transformed object
     */
    objectify(arr) {
        const obj = {};
        for (let i = 0, len = arr.length; i < len; i++) obj[this[$tpl][i]] = arr[i];
        return obj;
    }

    /**
     * Converts an object to an array
     * @param {object} obj - An object which fit the template
     * @return {array} The transformed array
     */
    arrayify(obj) {
        const t = this[$tpl],
            len = t.length,
            arr = Array.of(len).fill(null);
        for (let i = 0; i < len; i++) arr[i] = obj[t[i]];
        return arr;
    }

    /**
     * Gets the position of an item
     * @param {string|number} k - The keyName or the index of the template
     * @param {*} v - The value which we want it equal to
     * @param {number} p - The starting position
     * @return {number} The position
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
     * Modify an item
     * @param {array|object} item - The item to be converted
     * @return {array} The item which fit the template
     */
    modify(item) {
        item = Array.isArray(item) ? item : this.arrayify(item);
        const arr = Array(this[$tpl].length).fill(null);
        for (let i = 0, len = item.length; i < len; i++) {
            const data = item[i];
            const [keyName, types, isUnique] = this.template[i];
            let flag = false; // if allow item to be added
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
                if (isUnique && this.getItem(keyName, data)) throw new Error('Key already exists');
                else arr[i] = data;
            } else {
                throw new Error('This type of input is not allowed');
            }
        }
        return clone(arr);
    }

    /**
     * Reset an item
     * @example
     * storage.resetItem(0, [0, 'Amy', 'balabala...', null]); // => true
     * @param {number} pos - The position of the target item
     * @param {array} newItem - The new item
     * @return {this} allow chain calls
     */
    resetItem(pos, newItem) {
        const newVal = this.modify(newItem);
        this[$source][pos] = newVal;
        return this;
    }

    /**
     * Get a wanted item
     * @example
     * storage.getItem('name', 'Amy'); // => [0, 'Amy', 'balabala...', null]
     * @param {string} k - The keyName
     * @param {*} v - The value which we want it equal to
     * @param {number} p - The starting position
     * @return {array} The wanted item
     */
    getItem(k, v, p = 0) {
        const pos = this.position(k, v, p);
        if (pos < 0) return null;
        return clone(this[$source][pos]);
    }

    /**
     * Set a new item(item array)
     * @example
     * storage.setItem([0, 'Amy', 'balabala...', null]); // => true
     * @param {array|object} item - The item to be set, which must fit the template
     * @return {this} allow chain calls
     */
    setItem(item) {
        try {
            this[$source].push(this.modify(item));
            return this;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Insert an item by position
     * @param {number} pos - The position of the before an item
     * @param {array|object} item - The new item
     * @return {this} allow chain calls
     */
    insert(pos, item) {
        if (pos > this[$source].length - 1) return false;
        this[$source].splice(pos, 0, this.modify(item));
        return this;
    }

    /**
     * Deleta an item by position
     * @param {number} pos - The position of the target item
     * @return {boolean} if success
     */
    delete(pos) {
        if (pos > this[$source].length - 1) return -1;
        this[$source].splice(pos, 1);
        return true;
    }

    /**
     * Reverse all items
     * @return {array} raw source
     */
    reverse = () => this[$source].reverse() && this.source;

    /**
     * Sort all items
     * @param {function} f - The handler function
     * @return {array} raw source
     */
    sort = f => this[$source].sort(f) && this.source;

    /**
     * A cloned source
     * @member {array}
     */
    get source() {
        return clone(this[$source]);
    }

    /**
     * Set many items from an array or object
     * @param {array} objs - An array contains many objects or arrays, which must fit the template
     * @return {undefind}
     */
    from = objs => objs.forEach(e => this.setItem(this.modify(e)));

    /**
     * Convert whole items(the source) into an array which contain objects <br/>
     * This is a very useful function that you should call when querying data
     * @return {array} Complied source
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
    static from(objs) {
        const s = new this(...Object.keys(objs[0]));
        s.from(objs);
        return s;
    }
}

export default Listore;
