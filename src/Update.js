"use strict";

const E = require('./Error');

const table = require('./clauses/table');

const kvlist = require('./clauses/kvlist');

module.exports = class Update {
    constructor (keyspaceName, tableName) {
        this._table = table(keyspaceName, tableName);
    }


    set (assignments) {
        this._assignments = kvlist(assignments);
        return this;
    }


    where (rowSpec) {
        this._rowspec = kvlist(rowSpec);
        return this;
    }

    getValues () {
        let values = [];
        if ( this._assignments ) values = values.concat(this._assignments.values());
        if ( this._rowspec ) values = values.concat(this._rowspec.values());
        return values;
    }

    toString () {
        let q = ['UPDATE', this._table.name()];

        if ( this._assignments ) {
            q.push('SET');
            q.push(this._assignments.keys( key =>`${key} = ?`).join(', '));
        }

        if ( this._rowspec ) {
            q.push('WHERE');
            q.push(this._rowspec.keys( key =>`${key} = ?`).join(' AND '));
        }

        return q.join(' ');
    }
};
