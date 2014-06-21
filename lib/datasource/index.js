'use strict';

var platform = process.platform;

var ps   = require('./ps');
var wmic = require('./wmic');

//
// Decide which data source to use
//
module.exports.get = function _getDataSourceByPlatform() {

    if (platform === 'win32') {
        return wmic;
    }
    return ps;
};
