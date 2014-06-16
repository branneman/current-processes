'use strict';

var os   = require('os');
var exec = require('child_process').exec;

var inferColumnWidths = require('../string-helper').inferColumnWidths;

module.exports.get = function getCurrentProcessesLinux(cb) {

    exec('ps -A -o pid,vsz,comm', function(err, stdout) {

        // Bail out on error
        if (err) {
            return cb('Command `ps` returned an error!');
        }

        var lines  = stdout.split(os.EOL);
        var widths = _getColumnWidths(lines[0]);

        cb(null, lines
            .filter(function(line, index) {
                return line && index >= 1;
            })
            .map(function(line) {
                return {
                    pid: parseInt(widths[0].substr(line), 10),
                    name: widths[2].substr(line),
                    mem:  parseInt(widths[1].substr(line), 10)
                };
            }));
    });
};

function _getColumnWidths(line) {

    return inferColumnWidths([
        {
            query: 'PID',
            align: 'right'
        },
        {
            query: 'VSZ',
            align: 'right'
        },
        {
            query: 'COMMAND',
            align: 'left'
        }
    ], line);
}
