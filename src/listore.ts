if (!Object.entries)
    Object.entries = function (obj: any) {
        let ownProps = Object.keys(obj),
            i = ownProps.length,
            resArray = new Array(i);
        while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];
        return resArray;
    };

type KeyName = string;
type Constructor = Function;

interface PropOptions {
    type?: Constructor | Array<Constructor>;
    default?: any | ((data: any) => any); // default value will be applied only if value is undefined, see isset()
    required?: boolean; // default is false, so undefined is allowed (but not null), if set to true only allowed value that has correct type (set in type)
    validator?: (value: any) => boolean; // default value will also be checked by validator
}
type ObjectOptions = { [keyName: KeyName]: PropOptions | Constructor | Constructor[] };
type ArrayOptions = KeyName[] | [KeyName, PropOptions?][];
type Options = ObjectOptions | ArrayOptions;

interface Template extends PropOptions {
    keyName: KeyName;
}

type Config = Template[];

interface ItemObject {
    // {k1: v1, k2: v2, k3: v3, ...}
    [key: KeyName]: any;
}
type ItemArray = Array<any>; // [v1, v2, v3, ...]
const toStringTag = (data: any) => Object.prototype.toString.call(data).slice(8, -1);
const constructorCheck = (constructor: undefined | Constructor | Constructor[], data: any) => {
    if (!constructor) return true;
    return Array.isArray(constructor) ? constructor.some(c => toStringTag(data) === c.name) : toStringTag(data) === constructor.name;
};
const defaultGenerator = (data: any) => (typeof data === 'function' ? data() : data);
const isset = (value: any) => value !== undefined;
const warning = console.warn;
class Listore {
    #templates: Config = [];
    #length: number;
    #data: ItemArray[] = [];
    static constructorCheck = constructorCheck;
    constructor(tpl: Options) {
        let entries: [KeyName, PropOptions?][];
        if (Array.isArray(tpl)) {
            entries = tpl.map(item => {
                if (typeof item === 'string') return [item];
                else return item;
            });
        } else {
            entries = [];
            for (const [keyName, propOptions] of Object.entries(tpl)) {
                if (typeof propOptions === 'function') {
                    entries.push([keyName, { type: propOptions }]);
                } else if (Array.isArray(propOptions)) {
                    entries.push([keyName, { type: propOptions }]);
                } else {
                    entries.push([keyName, propOptions]);
                }
            }
        }
        // modify input options to [keyName, PropOptions?][]
        // TODO: check if all keys are unique
        this.#length = entries.length;
        this.#templates = entries.map(entry => {
            const [keyName, propOptions] = entry;
            return {
                ...propOptions,
                keyName,
            };
        });
    }
    size(): number {
        return this.#data.length;
    }

    /**
     * @description Insert single item, the default value will overwrite input if the key does not exists
     */
    insertOne(item: ItemArray): boolean {
        for (let i = 0; i < this.#length; i++) {
            const { type: typeConstructors, validator: userCheck, required: isRequired, default: defaultValue } = this.#templates[i];
            if (!isset(item[i])) item[i] = defaultGenerator(defaultValue); // consume default value
            if (isset(item[i])) {
                if (!constructorCheck(typeConstructors, item[i])) {
                    warning(`Prop '${this.#templates[i].keyName}' does not match type`, item[i], typeConstructors);
                    return false;
                }
                if (userCheck && !userCheck(item[i])) {
                    warning(`Prop '${this.#templates[i].keyName}' does not match validator`, item[i], userCheck);
                    return false;
                }
            } else {
                if (isRequired) {
                    console.warn(`Missing required prop: '${this.#templates[i].keyName}'`, item[i]);
                    return false;
                }
            }
        }
        this.#data.push(item);
        return true;
    }

    /**
     * @description Insert items by insert([v1, v2], [v1, v2], ...)
     */
    insert(...items: ItemArray[]): number {
        let insertedAmount = 0;
        for (let i = 0; i < items.length; i++) {
            if (this.insertOne(items[i])) {
                insertedAmount++;
            }
        }
        return insertedAmount;
    }

    /**
     * @description Delete all items by key
     * @returns The number of deleted items
     */
    delete(keyName: string, value: any): number {
        let removedAmount = 0;
        for (let i = 0; i < this.#data.length; i++) {
            const item = this.arrayToObject(this.#data[i]);
            if (item[keyName] === value) {
                this.#data.splice(i, 1);
                i--;
                removedAmount++;
            }
        }
        return removedAmount;
    }

    /**
     * @description Find all items by key
     * @returns  An array of objects, each object has key and value
     */
    find(keyName: string, value: any): ItemObject[] {
        const arr: ItemObject[] = [];
        for (let i = 0; i < this.#data.length; i++) {
            const item = this.arrayToObject(this.#data[i]);
            if (item[keyName] === value) {
                arr.push(item);
            }
        }
        return arr;
    }

    /**
     * @description Convert [v1, v2, ...] to {k1: v1, k2: v2, ...}
     * @param item  An array with values
     * @returns An object with key and value
     */
    arrayToObject(item: ItemArray): ItemObject {
        const obj: any = {};
        for (let i = 0; i < this.#length; i++) {
            obj[this.#templates[i].keyName] = item[i];
        }
        return obj;
    }

    /**
     * @description Convert {k1: v1, k2: v2, ...} to [v1, v2, ...]
     * @param item  An object with key and value
     * @returns An array with values
     */
    objectToArray(item: ItemObject): ItemArray {
        const arr: any[] = [];
        for (let i = 0; i < this.#length; i++) {
            arr.push(item[this.#templates[i].keyName]);
        }
        return arr;
    }

    *[Symbol.iterator](): IterableIterator<ItemObject> {
        const obj = this.toObject();
        for (let i = 0; i < obj.length; i++) {
            yield obj[i];
        }
    }

    entries() {
        return this[Symbol.iterator]();
    }

    /**
     * @description Convert all items to [{k1: v1, k2: v2}, {k1: v1, k2: v2}, ...]
     * @returns An array of objects
     */
    toObject(): ItemObject[] {
        return this.#data.map(items => {
            const obj: ItemObject = {};
            for (let i = 0; i < this.#length; i++) {
                obj[this.#templates[i].keyName] = items[i];
            }
            return obj;
        });
    }

    toString(): string {
        return JSON.stringify(this.toObject());
    }
}

export default Listore;
