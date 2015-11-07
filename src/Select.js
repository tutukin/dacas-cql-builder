"use strict";

const E = require('./Error');

const table = require('./clauses/table');

module.exports = class Select {
    constructor (list) {
        this.list = list || ['*'];
    }

    from (keyspaceName, tableName) {
        this._table = table(keyspaceName, tableName);
        return this;
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
        if ( ! this._table ) throw E('ClauseRequired', '"FROM" clause required: use .from() method!');
        let q = [
            'SELECT', this.list.join(', '),
            'FROM', this._table.name()
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
