'use strict';

var platform = process.platform;

var csv          = require('./csv');
var fixedColumns = require('./fixed-columns');
var fluidColumns = require('./fluid-columns');

//
// Decide which parser to use
//
module.exports.get = function _getParserByPlatform() {

    if (platform === 'win32') {
        return csv;
    } else if (platform === 'sunos') {
        return fluidColumns;
    }
    return fixedColumns;
};
