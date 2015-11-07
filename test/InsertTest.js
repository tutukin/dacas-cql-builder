"use strict";

const chai = require('chai');
const expect = chai.expect;

const CQL = require('../src/CQL');

describe('CQL', () => {
    describe('Insert', () => {
        describe('constructor()', () => {
            it('should throw if no arguments is provided', () => {
                expect(() => {
                    CQL.insert();
                }).to.throw(Error)
                .that.has.property('type')
                .that.equals('ArgumentRequired');
            });

            it('should accept the list of column names only', () => {
                expect( () => {
                    CQL.insert(['a', 'b', 'c']);
                }).to.not.throw;
            });

            it('should understand an object {colname: colvalue,...}', () => {
                let obj = {a:'aaa', b:'bbb'};
                let q = CQL.insert(obj).into('ks', 'tn');
                let cql = q.toString();

                let names = Object.keys(obj);
                let values = names.map( name => obj[name] );

                expect(cql).to.include(`INSERT INTO ks.tn (${names.join(', ')})`);
                expect(cql).to.include(`VALUES (${values.join(', ')})`);
            });
        });



        describe('#into(keyspaceName, tableName)', () => {
            it('should be an instance method', () => {
                expect(CQL.insert([])).itself.to.respondTo('into');
            });

            it('should provide the full table name to the query', () => {
                let ks = 'keyspace';
                let tn = 'tablename';
                let q = CQL.insert(['a']).values(['b']);

                q.into(ks, tn);

                expect(q.toString()).to.include(`INSERT INTO ${ks}.${tn}`);
            });

            it('should understand both keyspace and table name passed as an array', () => {
                let ks = 'keyspace';
                let tn = 'tablename';
                let q = CQL.insert(['a']).values(['b']);

                q.into([ks, tn]);

                expect(q.toString()).to.include(`INSERT INTO ${ks}.${tn}`);
            });
        });



        describe('#values()', () => {
            beforeEach( () => {
                this.insert = (names) => CQL.insert('ks', 'tn', names);
            });

            it('should be an instance method', () => {
                let q = this.insert();
                expect(q).itself.to.respondTo('values');
            });

            it('should add values clause', () => {
                let names = ['a', 'b'];
                let values = names.map( (v, i) => i);
                let q = this.insert(names).values(values);

                expect(q.toString()).to.include(`VALUES (${values.join(', ')})`);
            });
        });
    });
});
