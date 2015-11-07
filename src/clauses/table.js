"use strict";

const E = require('../Error');

class Table {
    constructor (keyspaceName, tableName) {
        if (! keyspaceName && ! tableName ) throw E('ArgumentRequired', 'At least table name must be provided');
        if ( keyspaceName && ! tableName ) {
            let a = keyspaceName;
            keyspaceName = tableName = null;

            if ( Array.isArray(a) ) {
                if ( a[1] ) {
                    tableName = a[1];
                    keyspaceName = a[0];
                }
                else {
                    tableName = a[0];
                }
            }
            else {
                tableName = a;
            }
        }

        this.keyspaceName = keyspaceName;
        this.tableName = tableName;
    }

    name () {
        let parts = [];
        if ( this.keyspaceName ) parts.push(this.keyspaceName);
        if ( this.tableName ) parts.push(this.tableName);

        if ( ! parts.length ) {
            // TODO: then what?
        }

        return parts.join('.');
    }
}


module.exports = (ks, tb) => new Table(ks, tb);
