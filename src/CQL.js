"use strict";

const Select = require('./Select');
const Insert = require('./Insert');
const Update = require('./Update');
const Delete = require('./Delete');

module.exports = {
    select: select,
    insert: insert,
    update: update,
    delete: droprow
};

function select (list) {
    return new Select(list);
}

function insert (keyspaceName, tableName, list) {
    return new Insert(keyspaceName, tableName, list);
}

function update (keyspaceName, tableName) {
    return new Update(keyspaceName, tableName);
}

function droprow (list) {
    return new Delete(list);
}
