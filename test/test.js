import Listore from '../lib/listore.js';
import { expect } from 'chai';

const listore = new Listore({
    id: {
        type: String,
        default: '',
    },
    name: String,
    price: {
        type: Number,
        validator: value => value > 0,
        default: 0,
    },
    quantity: String,
});

describe('Listore', function () {
    describe('#insert()', function () {
        it('returns inserted amount', function () {
            expect(listore.insert(['1', 'item1', 10, 'A'])).to.equal(1);
            expect(listore.insert(['2', 'item2', 20, 'B'])).to.equal(1);
            expect(listore.insert(['3', 'item3', 30, 'C'], ['4', 'item4', 40, 'D'])).to.equal(2);
        });
    });

    describe('#size()', function () {
        it('returns size of current listore', function () {
            expect(listore.size()).to.equal(4);
        });
    });

    describe('#find()', function () {
        it('finds sth', function () {
            expect(listore.find('id', '1')).to.deep.equal([{ id: '1', name: 'item1', price: 10, quantity: 'A' }]);
        });
    });

    describe('#delete()', function () {
        it('removes sth', function () {
            expect(listore.insert(['3', 'item3', 30, 'C'])).to.equal(1);
            expect(listore.delete('id', '3')).to.equal(2);
            expect(listore.delete('id', '4')).to.equal(1);
        });
    });

    // the previous test has removed some items and leaves the listore with only 2 items
    const remainings = [
        { id: '1', name: 'item1', price: 10, quantity: 'A' },
        { id: '2', name: 'item2', price: 20, quantity: 'B' },
    ];

    describe('#toObject()', function () {
        it('returns object', function () {
            expect(listore.toObject()).to.deep.equal(remainings);
        });
    });

    describe('#toString()', function () {
        it('returns string', function () {
            expect(listore.toString()).to.deep.equal(JSON.stringify(remainings));
        });
    });

    describe('#entries()', function () {
        it('returns iterator', function () {
            const iterator = listore.entries();
            expect(iterator.next().value).to.deep.equal(remainings[0]);
            expect(iterator.next().value).to.deep.equal(remainings[1]);
            expect(iterator.next().value).to.be.undefined;
        });
    });

    describe('#objectToArray()', function () {
        it('converts item to object form', function () {
            expect(listore.objectToArray({ id: '1', name: 'item1', price: 10, quantity: 'A' })).to.deep.equal(['1', 'item1', 10, 'A']);
            expect(listore.objectToArray({ id: '2', name: 'item2', price: 20, quantity: 'B' })).to.deep.equal(['2', 'item2', 20, 'B']);
            expect(listore.objectToArray({ id: '3', name: 'item3', price: 30, quantity: 'C' })).to.deep.equal(['3', 'item3', 30, 'C']);
        });
    });

    describe('#arrayToObject()', function () {
        it('converts item to array form', function () {
            expect(listore.arrayToObject(['1', 'item1', 10, 'A'])).to.deep.equal({ id: '1', name: 'item1', price: 10, quantity: 'A' });
            expect(listore.arrayToObject(['2', 'item2', 20, 'B'])).to.deep.equal({ id: '2', name: 'item2', price: 20, quantity: 'B' });
            expect(listore.arrayToObject(['3', 'item3', 30, 'C'])).to.deep.equal({ id: '3', name: 'item3', price: 30, quantity: 'C' });
        });
    });
});
