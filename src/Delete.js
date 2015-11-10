"use strict";

const E = require('./Error');

const table = require('./clauses/table');
const kvlist = require('./clauses/kvlist');

/**
    Class representing DELETE query
*/
module.exports = class Delete {
    /**
        Create DELETE query
        @param list - not implemented yet
    */
    constructor (list) {
        this._list = list;
    }

    /**
        Add FROM clause. At least one argument is required.
        That should be either {String} tableName or {Array}
        [keyspaceName, tableName].

        @param {String} keyspaceName - name of the keyspace
        @param {String} tableName - name of the table
        @returns {Delete} self for chaining
    */
    from (keyspaceName, tableName) {
        this._table = table(keyspaceName, tableName);
        return this;
    }

    /**
        Add WHERE clause.
        @param {Object} rowSpec - specification of the row to delete.
        {a: 1, b:'a'} means 'WHERE a = 1 AND b = "a"'
        @returns {Delete} self for chaining
    */
    where (rowSpec) {
        this._rowspec = kvlist(rowSpec);
        return this;
    }

    /**
        Returns query as a parametrized string. to be used with
        Delete#getValues()

        @returns {String} query
    */
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
