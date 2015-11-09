"use strict";

const chai = require('chai');
const expect = chai.expect;

const CQL = require('../src/CQL');

describe('CQL', () => {
    describe('Delete', () => {
        beforeEach( () => {
            this.delete = list => CQL.delete(list).from('ks', 'tn');
        });

        describe('constructor(list)', () => {
            it('should add DELETE clause', () => {
                let q = this.delete();
                expect(q.toString()).to.match(/^DELETE /);
            });
        });

        describe('#from(keyspaceName, tableName)', () => {
            it('should add FROM clause', () => {
                let q = CQL.delete().from('keyspace', 'table');
                expect(q.toString()).to.include('DELETE FROM keyspace.table');
            });

            it('should return self for chaining', () => {
                let q = CQL.delete();
                expect(q.from('a', 'b')).to.equal(q);
            });
        });

        describe('#where(rowSpec)', () => {
            it('should be an instance method', () => {
                let q = this.delete();
                expect(q).itself.to.respondTo('where');
            });

            it('should return self for chaining', () => {
                let q = this.delete();
                expect(q.where({a:'b'})).to.equal(q);
            });

            it('should add WHERE clause', () => {
                let q = this.delete().where({a: 'a', b: 'b'});
                expect(q.toString()).to.include('WHERE a = ? AND b = ?');
            });
        });
    });
});
