"use strict";

const E = require('./Error');

module.exports = class Select {
    constructor (list) {
        this.list = list || ['*'];
    }

    from (keyspaceName, tableName) {
        if (! keyspaceName && ! tableName ) throw E('ArgumentRequired', 'At least table name must be provided');
        if ( keyspaceName && ! tableName ) {
            tableName = keyspaceName;
            keyspaceName = null;
        }

        this.keyspaceName = keyspaceName;
        this.tableName = tableName;

        return this;
    }

    fullTableName () {
        return this.keyspaceName ?
                [this.keyspaceName, this.tableName].join('.') :
            this.tableName ?
                this.tableName :
                undefined;
    }

    where (relations) {
        this.relations = relations;
        return this;
    }

    parseRelations () {
        return Object.keys(this.relations).map( (key) => {
            let value = _literal(this.relations[key]);
            return `${key} = ${value}`;
        });

        function _literal (v) {
            return typeof v === 'string' ?
                `'${v}'` :
                v;
        }
    }

    toString () {
        let from = this.fullTableName();
        if ( ! from ) throw E('ClauseRequired', '"FROM" clause required: use .from() method!');
        let q = [
            'SELECT', this.list.join(', '),
            'FROM', from
        ];

        if ( this.relations ) {
            q.push('WHERE');
            q.push(this.parseRelations().join(' AND '));
        }

        return q.join(' ');
    }
};
