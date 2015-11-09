const chai = require('chai');
const expect = chai.expect;

describe('CQL', () => {
    beforeEach( () => {
        this.CQL = require('../src/CQL');
    });

    describe('.select(list)', () => {
        it('should be a function', () => {
            expect(this.CQL).itself.to.respondTo('select');
        });
    });

    describe('.insert(keyspaceName, tableName)', () => {
        it('should be a function', () => {
            expect(this.CQL).itself.to.respondTo('insert');
        });
    });

    describe('.update(keyspaceName, tableName)', () => {
        it('should be a function', () => {
            expect(this.CQL).itself.to.respondTo('update');
        });
    });

    describe('.delete(list)', () => {
        it('should be a function', () => {
            expect(this.CQL).itself.to.respondTo('delete');
        });
    });
});
