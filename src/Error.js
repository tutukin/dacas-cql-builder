"use strict";

module.exports = function (type, message, data) {
    let e = Error(message || 'Error');
    e.type = type;
    if (data) e.data = data;
    return e;
};
