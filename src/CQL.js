"use strict";

const Select = require('./Select');
const Insert = require('./Insert');

module.exports = {
    select: select,
    insert: insert
};

function select (list) {
    return new Select(list);
}

function insert (keyspaceName, tableName, list) {
    return new Insert(keyspaceName, tableName, list);
}
