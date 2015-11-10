"use strict";

const E = require('./Error');

const table = require('./clauses/table');
const kvlist = require('./clauses/kvlist');

/**
    Class representing the SELECT query
*/
module.exports = class Select {
    /**
        Create the query
        @param {Array} list - list of column names
    */
    constructor (list) {
        this.list = list || ['*'];
    }

    /**
        Add FROM clause to the query. At least one argument
        is required. It should be either {String} tableName,
        or {Array} [keyspaceName, tableName]

        @param {String} keyspaceName - name of the keyspace
        @param {String} tableName - name of the table
        @returns {Select} self for chaining.
    */
    from (keyspaceName, tableName) {
        this._table = table(keyspaceName, tableName);
        return this;
    }

    /**
        Add WHERE clause. Right now only equality relations are
        supported: {a: 1, b: 2} means 'a = 1 AND b = 2'

        @param {Object} relations
        @returns {Select} self for chaining
    */
    where (relations) {
        this._relations = kvlist(relations);
        return this;
    }

    /**
        Add ORDER BY clause.

        @param {Object} list - {key: <ordering>}, where key is a column
        name and ordering is either 'ASC', 'DESC', a positive integer
        (same as 'ASC'), or negative integer (same as 'DESC');
        @returns {Select} self for chaining
    */
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

    /**
        Add «LIMIT n» clause
        @param {Number} n
        @returns {Select} self for chaining
    */
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

    /**
        Return the list of values to be used along with the query
    */
    getValues () {
        return this._relations.values();
    }

    /**
        return query where all relations' values are replaced with '?'
        use Select#getValues() to get the list of the query params
        @returns {String} query
    */
    toString () {
        if ( ! this._table ) throw E('ClauseRequired', '"FROM" clause required: use .from() method!');
        let q = [
            'SELECT', this.list.join(', '),
            'FROM', this._table.name()
        ];

        if ( this._relations ) {
            q.push('WHERE');
            q.push(this._relations.keys( key =>`${key} = ?`).join(' AND '));
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
