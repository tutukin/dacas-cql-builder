"use strict";

/**
    @module CQL
*/

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

/**
    Create SELECT query
*/
function select (list) {
    return new Select(list);
}

/**
    Create INSERT query
*/
function insert (keyspaceName, tableName, list) {
    return new Insert(keyspaceName, tableName, list);
}

/**
    Create UPDATE query
*/
function update (keyspaceName, tableName) {
    return new Update(keyspaceName, tableName);
}

/**
    Create DELETE query
*/
function droprow (list) {
    return new Delete(list);
}
