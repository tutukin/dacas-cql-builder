"use strict";

const E = require('../Error');

const obj2arr = o => Object.keys(o).map( key => {
    return {key: key, value: o[key]};
});

const IDENTITY = a => a;


class KeyValueList {
    constructor (obj) {
        this._list = obj2arr(obj);
    }

    keys (fn) {
        fn = fn || IDENTITY;
        return this._list.map( _ => fn(_.key) );
    }

    values (fn) {
        fn = fn || IDENTITY;
        return this._list.map( _ => fn(_.value) );
    }
}

module.exports = (obj) => new KeyValueList(obj);
