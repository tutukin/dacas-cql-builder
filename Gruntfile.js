"use strict";

module.exports = function (grunt) {
    var gtx  = require('gruntfile-gtx').wrap(grunt);
    var conf = require('./grunt');

    gtx.loadAuto();

    gtx.config(conf);

    gtx.alias('default', ['watch']);
    gtx.finalise();
};
