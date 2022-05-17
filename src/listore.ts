type KeyName = string;
type Constructor = Function;

interface Options {
    type?: Constructor | Constructor[];
    validator?: (value: any) => boolean;
    required?: boolean; // TODO: not implemented yet
    default?: any | ((data: any) => any); // TODO: fix behaviour
}

interface ModifiedOptions extends Options {
    type?: Constructor[]; // if has, must be array, otherwise allow anything
}

type Template = { [keyName: KeyName]: Options } | KeyName[];

interface Config extends ModifiedOptions {
    keyName: KeyName;
}
interface ItemObject {
    // {k1: v1, k2: v2, k3: v3, ...}
    [key: KeyName]: any;
}
type ItemArray = Array<any>; // [v1, v2, v3, ...]
const constructorCheck = (constructor: Constructor, data: any) => Object.prototype.toString.call(data).slice(8, -1) === constructor.name;
const defaultGenerator = (data: any) => (typeof data === 'function' ? data() : data);
const isset = (value: any) => value !== undefined && value !== null;
class Listore {
    #templates: Config[] = [];
    #length: number;
    #data: ItemArray[] = [];
    static constructorCheck = constructorCheck;
    constructor(tpl: Template) {
        if (Array.isArray(tpl)) {
            this.#length = tpl.length;
            this.#templates = tpl.map(keyName => ({ keyName, required: true }));
        } else {
            const entries = Object.entries(tpl);
            this.#length = entries.length;
            this.#templates = entries.map(([keyName, options]) => {
                if (typeof options === 'function') options = { type: [options] };
                else if (typeof options.type === 'function') options.type = [options.type];
                return { keyName, ...(options as ModifiedOptions) };
            });
        }
    }
    size(): number {
        return this.#data.length;
    }

    insertOne(item: ItemArray): boolean {
        if (item.length !== this.#length) return false;
        for (let i = 0; i < this.#length; i++) {
            const { type: typeConstructors, validator: userCheck, required, default: defaultValue } = this.#templates[i];
            let current = item[i];
            if (!isset(current)) {
                if (isset(defaultValue)) current = defaultGenerator(defaultValue);
                else return false;
            }
            if (typeConstructors && !typeConstructors.some(c => constructorCheck(c, item[i]))) return false;
            if (typeof userCheck === 'function' && userCheck(item[i]) === false) return false; // extra check by user
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
