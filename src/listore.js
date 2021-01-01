import clone from './clone.js';

const $source = Symbol('Source: array');
const $tpl = Symbol('Template: string');

class Listore {
    /**
     * The source array, which is protected
     * @type {array}
     */
    [$source] = [];
    /**
     * Generate an instance of Listore by a template<br/>
     * As the example shows below, the template contains many objects(or string) and the config is an object<br/><br/>
     * So far we have some settings in the <i>template</i> : {key, isUique, check, fmt, default}<br/>
     * <strong>key</strong>: Corresponds to the key name of the object generated when the toObject function is called<br/>
     * <strong>isUique</strong>: Whether repetition is allowed. This is useful when you need item to be unique<br/>
     * <strong>check</strong>: An array of functions is included to check if the input is correct. The new data is checked by each function in the array (the function should return true or false). If the return value != true, the program reports an error<br/>
     * <strong>fmt</strong>: A function used to format the input is run before the check function, which actually checks the formatted data<br/>
     * <strong>default</strong>: Default value, if set, when fail to check, it will be used<br/>
     * You can get the template attribute to see the complied array template, such as `storage.template`, changes to this array is no allowed as it is freezed<br/><br/>
     * <strong>onchange</strong>: callback -> instantiated(listore), setItem(the set item or deleted), calledFunctionName(string)<br/>
     * @param {array} template - The template for item, which corresponds to the Listore's instance function
     * @param {function} onchange - onchange
     * @example
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

     */
    constructor(template, onchange) {
        // template: [{key,isUnique,check,fmt,default}]
        if (!Array.isArray(template)) throw new Error("Listore: 'template' should be an array");
        this.onchange = onchange; // be cautious in case it is undefined
        this.template = Object.freeze(clone(template));
        this[$tpl] = Object.freeze(this.template.map(e => (typeof e === 'string' ? e : e.key))); // keys template
        if (new Set(this[$tpl]).size !== template.length) throw new Error("Listore: 'key' cannot be the same"); // check
        for (let tpl of this.template) {
            if (typeof tpl === 'string') continue;
            if (typeof tpl.key !== 'string') throw new Error("Listore: 'key' must be a string");
            if (!!tpl.fmt) if (typeof tpl.fmt !== 'function') throw new Error("Listore: 'fmt' must be a function");
            if (!!tpl.check) if (!Array.isArray(tpl.check)) throw new Error("Listore: 'check' must be a array");
            for (let checker of tpl.check) {
                if (typeof checker !== 'function') throw new Error("Listore: 'check' must be a function array");
                if (tpl.default) if (!checker(tpl.default)) throw new Error("Listore: 'default' should fit checkers");
            }
        }
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
            let tpl = this.template[i];
            const keyName = this[$tpl][i];
            const { check: checkers = [], fmt: formatter, default: defaultValue, isUnique } = tpl;
            let data = formatter ? formatter(item[i]) : item[i]; // target

            checkers.forEach(checker => {
                if (!checker(data)) {
                    if (defaultValue) {
                        data = defaultValue;
                    } else {
                        throw new Error('Listore: this item is not allow by custom checker');
                    }
                }
            });

            if (isUnique && this.getItem(keyName, data)) throw new Error('Listore: key already exists');
            else arr[i] = data;
        }

        return clone(arr); // It's important that clone this array, so as to avoid external modifications
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
        this.onchange && this.onchange(this, newVal, 'resetItem'); // trace
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
            const newItem = this.modify(item);
            this[$source].push(newItem);
            this.onchange && this.onchange(this, newItem, 'setItem'); // trace
            return this;
        } catch (err) {
            throw err;
        }
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
     * Insert an item by position
     * @param {number} pos - The position of the before an item
     * @param {array|object} item - The new item
     * @return {this} allow chain calls
     */
    insert(pos, item) {
        if (pos > this[$source].length - 1) return false;
        const newItem = this.modify(item);
        this[$source].splice(pos, 0, newItem);
        this.onchange && this.onchange(this, newItem, 'insert'); // trace
        return this;
    }

    /**
     * Deleta an item by position
     * @param {number} pos - The position of the target item
     * @return {boolean} if success
     */
    delete(pos) {
        if (pos > this[$source].length - 1) return -1;
        const deleted = clone(this[$source][pos]);
        this[$source].splice(pos, 1);
        this.onchange && this.onchange(this, deleted, 'delete'); // trace
        return true;
    }

    extend(fn, func) {}

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

    /**
     * Automatic from function
     * @return {undefind}
     * @static
     */
    static from(objs) {
        const s = new this(Object.keys(objs[0]));
        s.from(objs);
        return s;
    }
}

export default Listore;
