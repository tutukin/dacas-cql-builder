"use strict";

const chai = require('chai');
const expect = chai.expect;

const CQL = require('../src/CQL');

describe('CQL', () => {
    describe('Select', () => {
        describe('.constructor(list)', () => {
            beforeEach( () => {
                this.select = (list) => CQL.select(list).from('ks','tb');
            });

            it('should not require a list', () => {
                let q;
                expect(() => {
                    let q = CQL.select();
                }).to.not.throw;
            });

            it('should understand a selection list', () => {
                let list = 'a b c'.split(' ');
                let q = this.select(list);

                expect(q.toString()).to.include('SELECT ' + list.join(', '));
            });
        });


        describe('#from(keyspaceName,tableName)', () => {
            beforeEach( () => {
                this.q = CQL.select();
                this.ksn = 'ksname';
                this.tbn = 'tbname';
            });

            it('should be an instance method', () => {
                expect(this.q).itself.to.respondTo('from');
            });

            it('should throw if no arguments is provided', () => {
                expect(() => {
                    let q = this.q.from();
                }).to.throw(Error)
                .that.has.property('type')
                .that.equals('ArgumentRequired');

            });

            it('should return the query object for chaining', () => {
                let q = this.q.from(this.ksn, this.tbn);
                expect(q).to.equal(this.q);
            });

            it('should set the keyspace name and table name', () => {
                let q = this.q.from(this.ksn, this.tbn);
                expect(q.toString()).to.include(`FROM ${this.ksn}.${this.tbn}`);
            });

            it('should understand a single argument', () => {
                let q = this.q.from(this.tbn);
                expect(q.toString()).to.include(`FROM ${this.tbn}`);
            });

            it('should understand .from(null, tableName) invocation', () => {
                let q = this.q.from(null, this.tbn);
                expect(q.toString()).to.include(`FROM ${this.tbn}`);
            });
        });



        describe('#where(relations)', () => {
            beforeEach( () => {
                this.select = (list) => CQL.select(list).from('kn', 'tb');
            });

            it('should be an instance method', () => {
                let q = this.select();
                expect(q).itself.to.respondTo('where');
            });

            it('should undestand equality relation .where({name:value})', () => {
                let q = this.select().where({
                    identity: 'established',
                    mistake: 0
                });

                expect(q.toString()).to.include('WHERE identity = \'established\' AND mistake = 0');
            });
        });



        describe('#toString()', () => {
            it('should throw if no from clause was provided', () => {
                let q = CQL.select();

                expect(() => {
                    q.toString();
                }).to.throw(Error)
                    .that.has.property('type')
                    .that.equals('ClauseRequired');
            });
        });
    });
});
