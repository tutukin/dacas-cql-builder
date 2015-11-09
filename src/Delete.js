"use strict";

const E = require('./Error');

const table = require('./clauses/table');
const kvlist = require('./clauses/kvlist');

module.exports = class Delete {
    constructor (list) {
        this._list = list;
    }

    from (keyspaceName, tableName) {
        this._table = table(keyspaceName, tableName);
        return this;
    }

    where (rowSpec) {
        this._rowspec = kvlist(rowSpec);
        return this;
    }

    toString () {
        let q = ['DELETE'];

        // TODO: require .from() before stringifying!
        q.push('FROM');
        q.push( this._table.name() );

        if ( this._rowspec ) {
            q.push('WHERE');
            q.push( this._rowspec.keys( key => `${key} = ?`).join(' AND ') );
        }

        return q.join(' ');
    }
};
