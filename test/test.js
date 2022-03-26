import Listore from '../lib/listore.js';
import assert from 'assert';

const listore = new Listore('id', 'name', 'price', 'quantity');

describe('Listore', function () {
    describe('#append()', function () {
        it('returns undefined', function () {
            assert.equal(listore.append('1', 'item1', 10, 'A'), undefined);
            assert.equal(listore.append('2', 'item1', 10, 'B'), undefined);
            assert.equal(listore.append('3', 'item1', 10, 'C'), undefined);
            assert.equal(listore.append('3', 'item1', 10, 'D'), undefined);
            assert.equal(listore.append('4', 'item1', 10, 'E'), undefined);
        });
    });

    describe('#object()', function () {
        it('converts item to object form', function () {
            for (let item of listore) {
                console.log(item);
            }

            assert.equal(
                JSON.stringify(listore.object('1', 'item1', '10', '1')),
                JSON.stringify({ id: '1', name: 'item1', price: '10', quantity: '1' }),
            );
            assert.equal(
                JSON.stringify(listore.object(2, 'item2', 10, 1)),
                JSON.stringify({ id: 2, name: 'item2', price: 10, quantity: 1 }),
            );
        });
    });

    describe('#find()', function () {
        it('finds sth', function () {
            assert.equal(JSON.stringify(listore.find('id', '4')), `[{"id":"4","name":"item1","price":10,"quantity":"E"}]`);
        });
    });

    describe('#remove()', function () {
        it('removes sth', function () {
            assert.equal(listore.remove('id', '3'), 2);
            assert.equal(listore.remove('id', '4'), 1);
        });
    });

    describe('#toObject()', function () {
        it('returns object', function () {
            assert.equal(
                JSON.stringify(listore.toObject()),
                `[{"id":"1","name":"item1","price":10,"quantity":"A"},{"id":"2","name":"item1","price":10,"quantity":"B"}]`,
            );
        });
    });
});
