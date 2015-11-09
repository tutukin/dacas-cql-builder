"use strict";

const chai = require('chai');
const expect = chai.expect;

const CQL = require('../src/CQL');

describe('CQL', () => {
    describe('Select', () => {
        beforeEach( () => {
            this.select = (list) => CQL.select(list).from('kn', 'tb');
        });


        describe('.constructor(list)', () => {
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
            it('should be an instance method', () => {
                let q = this.select();
                expect(q).itself.to.respondTo('where');
            });

            it('should undestand equality relation .where({name:value})', () => {
                let q = this.select().where({
                    identity: 'established',
                    mistake: 0
                });

                expect(q.toString()).to.include('WHERE identity = ? AND mistake = ?');
            });
        });



        describe('#order(list)', () => {
            it('should be a function', () => {
                expect(CQL.select()).itself.to.respondTo('order');
            });

            it('should understand a list of type {col1:"asc", col2:"desc"}', () => {
                let q = this.select().order({
                    col1:'asc',
                    col2:'desc'
                });

                expect(q.toString()).to.include('ORDER BY col1 ASC, col2 DESC');
            });

            it('should understand integers as ordering', () => {
                let q = this.select().order({
                    col1:  1,
                    col2: -1
                });

                expect(q.toString()).to.include('ORDER BY col1 ASC, col2 DESC');
            });

            it('should throw Error.UnknownOrdering if incorrect ordering is requested', () => {
                expect(() => {
                    this.select().order({col1:'sc'});
                }).to.throw(Error)
                .that.has.property('type')
                .that.equals('UnknownOrdering');
            });
        });



        describe('#limit(n)', () => {
            it('should be a function', () => {
                expect(CQL.select()).itself.to.respondTo('limit');
            });

            it('should add limit clause to the query', () => {
                let q = this.select().limit(12);
                expect(q.toString()).to.include('LIMIT 12');
            });

            it('should accept a digits-only string', () => {
                let q = this.select().limit('13');
                expect(q.toString()).to.include('LIMIT 13');
            });

            it('should throw Error:NaNLimit if not a clean number is passed', () => {
                expect(() => {
                    this.select().limit('13k');
                }).to.throw(Error)
                .that.has.property('type')
                .that.equals('NaNLimit');
            });
        });



        describe('#getValues()', () => {
            it('should be an instance method', () => {
                expect(this.select()).itself.to.respondTo('getValues');
            });

            it('should return values from relations', () => {
                let q = this.select().where({a:'aaa', b:1});

                expect(q.getValues()).to.deep.equal(['aaa',1]);
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
