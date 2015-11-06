"use strict";

const Select = require('./Select');

module.exports = {
    select: select
};

function select (list) {
    return new Select(list);
}
