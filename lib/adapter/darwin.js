'use strict';

var getCurrentProcessesLinux = require('./linux').get;
var inferColumnWidths = require('../string-helper').inferColumnWidths;

module.exports.get = function getCurrentProcessesDarwin(cb) {

    getCurrentProcessesLinux(function(err, processes) {

        if (err) return cb(err);

        processes
            .map(function(proc) {

                // Shorten path to only the executable
                proc.name = proc.name.substr(proc.name.lastIndexOf('/') + 1);

                return proc;
        });

        cb(null, processes);

    }, _getColumnWidths);
};

function _getColumnWidths(line) {

    return inferColumnWidths([
        {
            query: 'PID',
            align: 'right'
        },
        {
            query: 'RSS',
            align: 'right'
        },
        {
            query: 'VSZ',
            align: 'right'
        },
        {
            query: '%CPU',
            align: 'right'
        },
        {
            query: 'COMM',
            align: 'left'
        }
    ], line);
}
