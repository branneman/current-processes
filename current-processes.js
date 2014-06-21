'use strict';

var async = require('async');

var dataSource  = require('./lib/datasource').get();
var parser      = require('./lib/parser').get();
var procFactory = require('./lib/model/process').factory;

module.exports.get = function getCurrentProcesses(cb) {

    async.waterfall([
        dataSource,
        parser,
        procFactory
    ], cb);
};
