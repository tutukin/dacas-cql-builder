"use strict";

const chai = require('chai');
const expect = chai.expect;

const CQL = require('../src/CQL');

describe('CQL', () => {
    describe('Update', () => {
        beforeEach( () => {
            this.update = () => CQL.update('kn', 'tb');
        });

        describe('constructor(keyspaceName, tableName)', () => {
            it('should add UPDATE clause to the query', () => {
                let q = CQL.update('keyspace', 'table');
                expect(q.toString()).to.include('UPDATE keyspace.table');
            });
        });


        describe('#set(assignments)', () => {
            it('should be an instance method', () => {
                expect(this.update()).itself.to.respondTo('set');
            });

            it('should return self for chaining', () => {
                let q = this.update();
                expect(q.set({a:1})).to.equal(q);
            });

            it('should add SET clause', () => {
                let q = this.update().set({a:'aaa', b:1});
                expect(q.toString()).to.include('SET a = ?, b = ?');
            });
        });


        describe('#where(rowSpec)', () => {
            it('should be a function', () => {
                expect(this.update()).itself.to.respondTo('where');
            });

            it('should return self for chaining', () => {
                let q = this.update();
                expect(q.where({a:1})).to.equal(q);
            });

            it('should add WHERE statement', () => {
                let q = this.update().where({a:1, b:'c'});
                expect(q.toString()).to.include('WHERE a = ? AND b = ?');
            });
        });


        describe('#getValues()', () => {
            it('should be an instance method', () => {
                expect(this.update()).itself.to.respondTo('getValues');
            });

            it('should return list of values in SET and then WHERE clauses', () => {
                let q = this.update().set({a:1, b:2}).where({c:3, d:4});

                expect(q.getValues()).to.deep.equal([1,2,3,4]);
            });
        });
    });
});
