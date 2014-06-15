'use strict';

var getCurrentProcessesLinux = require('./linux').get;

module.exports.get = function getCurrentProcessesDarwin(cb) {

    var processes = getCurrentProcessesLinux(cb);

    return processes
        .map(function(proc) {

            // Shorten path to only the executable
            proc.name = proc.name.substr(proc.name.lastIndexOf('/') + 1);

            return proc;
        });
};
