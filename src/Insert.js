"use strict";

const E = require('./Error');
const table = require('./clauses/table');

/**
    Class representing INSERT query

    Example:

    ```javascript
        let row = { a: 'aaa', b: 'bbb' };
        let q = Insert(row).into([keyspaceName, tableName]);
        driver.exec(q.toString(), q.getValues()).then(processResults, processError);
    ```
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

    getValues () {
        return this._values.slice();
    }


    toString () {
        let cql = [
            'INSERT INTO', this._table.name(),
            `(${this._colnames.join(', ')})`,
            'VALUES', `(${this._values.map(_=>'?').join(', ')})`
        ];

        return cql.join(' ');
    }
};
