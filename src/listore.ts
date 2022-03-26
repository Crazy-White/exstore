class Listore {
    protected _template: string[];
    protected _length: number;
    protected _data: any[];
    constructor(...tpl: string[]) {
        this._template = tpl;
        this._length = tpl.length;
        this._data = [];
    }
    append(...data: any[]): void {
        if (data.length !== this._length) {
            throw new Error('length is not equal');
        }
        this._data.push(data);
    }
    remove(keyName: string, value: any): number {
        let removedAmount = 0;
        for (let i = 0; i < this._data.length; i++) {
            const item = this.object(...this._data[i]);
            if (item[keyName] === value) {
                this._data.splice(i, 1);
                i--;
                removedAmount++;
            }
        }
        return removedAmount;
    }
    find(keyName: string, value: any): object[] {
        const arr = [];
        for (let i = 0; i < this._data.length; i++) {
            const item = this.object(...this._data[i]);
            if (item[keyName] === value) {
                arr.push(item);
            }
        }
        return arr;
    }
    object(...item: any): any {
        const obj: any = {};
        for (let i = 0; i < this._length; i++) {
            obj[this._template[i]] = item[i];
        }
        return obj;
    }
    *[Symbol.iterator](): IterableIterator<object> {
        const obj = this.toObject();
        for (let i = 0; i < obj.length; i++) {
            yield obj[i];
        }
    }
    entries() {
        return this[Symbol.iterator]();
    }
    toObject(): object[] {
        return this._data.map(items => {
            const obj: any = {};
            for (let i = 0; i < this._length; i++) {
                obj[this._template[i]] = items[i];
            }
            return obj;
        });
    }
    toString(): string {
        return JSON.stringify(this.toObject());
    }
}

export default Listore;
