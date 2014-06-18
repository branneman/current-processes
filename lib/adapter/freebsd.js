'use strict';

var getCurrentProcessesLinux = require('./linux').get;

module.exports.get = getCurrentProcessesLinux;
