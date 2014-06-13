'use strict';

var platform = process.platform;
var adapter  = require('./lib/adapter/' + platform);

module.exports.get = function getCurrentProcesses(cb) {
    return adapter.get(cb);
};
