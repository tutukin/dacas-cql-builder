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

    order (list) {
        this.orderList = _parse(list);
        return this;

        function _parse (list) {
            list = list || {};
            return Object.keys(list).reduce((pl, field) => {
                pl[field] = _ordering(list[field]);
                return pl;
            }, {});
        }

        function _ordering (x) {
            let o = typeof x === 'string' ?
                    x.toUpperCase() :
                typeof x === 'number' ?
                    ( x > 0 ? 'ASC' : x < 0 ? 'DESC' : null):
                    null;
            if ( ! o || ['ASC', 'DESC'].indexOf(o) < 0 ) throw E('UnknownOrdering', `Unknown ordering '${x}'`);
            return o;
        }
    }

    parseOrderList (){
        return Object.keys(this.orderList).map( k => {
            return `${k} ${this.orderList[k]}`;
        });
    }

    limit (n) {
        this.limit = _parseInt(n);
        return this;

        function _parseInt (n) {
            let type = typeof n;
            if ( type === 'number' ) return n;
            if ( type === 'string' && n.match(/^\d+$/) ) return parseInt(n, 10);
            throw E('NaNLimit', 'limit should be a number or a string of digits');
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

        if ( this.orderList ) {
            q.push('ORDER BY');
            q.push(this.parseOrderList().join(', '));
        }

        if ( typeof this.limit === 'number' ) {
            q.push('LIMIT');
            q.push(this.limit);
        }

        return q.join(' ');
    }
};
