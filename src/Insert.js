"use strict";

const E = require('./Error');
const table = require('./clauses/table');

/*
    # Plain syntax
    let colnames = ['a', 'b', 'c'];
    let values = [1,2,3];
    CQL.insert(ks, tn, colnames).values(values);
    CQL.insert(colnames).into(ks, tn).values(values);

    # clever
    let obj = colnames.reduce( (o, key, i) => { o[key] = values[i]; return o; }, {});
    CQL.insert(obj).into(ks, tn);
*/

module.exports = class Insert {
    constructor () {
        let args = Array.prototype.slice.apply(arguments);
        args = _filter(args);
        let l = args.length;
        if ( l < 1 ) throw E('ArgumentRequired', 'Table name and column names list are required');

        if ( Array.isArray(args[l-1]) ) {
            this._colnames = args.pop();
        }
        else if (typeof args[l-1] === 'object' ) {
            let obj = args.pop();
            this._colnames = Object.keys(obj);
            this.values( this._colnames.map( name => obj[name] ));
            console.dir(this);
        }

        if ( args.length ) this.into(args);

        function _filter (arr) {
            let i = arr.length - 1;
            while ( i >= 0 && typeof arr[i] === 'undefined' ) i--;
            return arr.slice(0, i+1);
        }
    }

    into (keyspaceName, tableName) {
        this._table = table(keyspaceName, tableName);
        return this;
    }


    values (list) {
        this._values = list;
        return this;
    }


    toString () {
        let cql = [
            'INSERT INTO', this._table.name(),
            `(${this._colnames.join(', ')})`,
            'VALUES', `(${this._values.join(', ')})`
        ];

        return cql.join(' ');
    }
};
