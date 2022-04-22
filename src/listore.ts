type Types = 'object' | 'string' | 'number' | 'boolean' | 'bigint' | 'symbol' | 'function' | 'array';
interface Template {
    key: string;
    type: Types;
    check?: (value: any) => boolean;
}
type KeyNames = string;
interface ItemObject {
    // {k1: v1, k2: v2, k3: v3, ...}
    [key: KeyNames]: any;
}
type ItemArray = Array<any>; // [v1, v2, v3, ...]

class Listore {
    #keyNames: KeyNames[]; // the key names of the template
    #template: Template[] | undefined;
    #length: number;
    #data: ItemArray[] = [];
    constructor(tpl: KeyNames[] | Template[]) {
        if (!tpl.length) {
            throw new Error('Template is empty');
        }
        if (typeof tpl[0] === 'string') {
            this.#keyNames = tpl as KeyNames[];
            this.#length = tpl.length;
        } else if (typeof tpl[0] === 'object') {
            this.#keyNames = tpl.map(item => (item as Template).key);
            this.#template = tpl as Template[];
            this.#length = tpl.length;
        } else {
            throw new Error('Template is not valid');
        }
    }
    size(): number {
        return this.#data.length;
    }

    check(item: ItemArray): boolean {
        if (item.length !== this.#length) {
            return false;
        }
        if (this.#template) {
            for (let i = 0; i < this.#length; i++) {
                const current = item[i],
                    { type, check: userCheck } = this.#template[i];

                if (type === 'array') {
                    if (!Array.isArray(current)) return false; // extra check for array
                    continue;
                }

                if (type === 'object') {
                    if (Array.isArray(current)) return false; // can't be array
                    if (Boolean(current) !== true) return false; // can't be null
                }

                if (typeof current !== type) return false;

                if (typeof userCheck === 'function') return userCheck(current); // extra check by user
            }
        }
        return true;
    }

    /**
     * @description Insert items by insert([v1, v2], [v1, v2], ...)
     */
    insert(...items: ItemArray[]): number {
        let insertedAmount = 0;
        for (let i = 0; i < items.length; i++) {
            if (this.check(items[i])) {
                this.#data.push(items[i]);
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
            obj[this.#keyNames[i]] = item[i];
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
            arr.push(item[this.#keyNames[i]]);
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
                obj[this.#keyNames[i]] = items[i];
            }
            return obj;
        });
    }

    toString(): string {
        return JSON.stringify(this.toObject());
    }
}

export default Listore;
