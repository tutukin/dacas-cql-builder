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
});
