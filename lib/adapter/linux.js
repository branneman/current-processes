'use strict';

var os    = require('os');
var exec  = require('child_process').exec;
var toInt = function(str) { return parseInt(str, 10) };

var inferColumnWidths = require('../string-helper').inferColumnWidths;

module.exports.get = function getCurrentProcessesLinux(cb, _getColumnWidths) {

    var cmd = 'ps -A -o pid,vsz,pcpu,comm';

    exec(cmd, function(err, stdout) {

        if (err) {
            return cb('Command `ps` returned an error!');
        }

        var lines = stdout.split(os.EOL);
        var widths;
        if (_getColumnWidths) {
            widths = _getColumnWidths(lines[0]);
        } else {
            widths = _getColumnWidthsLinux(lines[0]);
        }

        cb(null, lines
            .filter(function(line, index) {
                return line && index >= 1;
            })
            .map(function(line) {
                return {
                    pid:  toInt(widths[0].getValue(line)),
                    name: widths[3].getValue(line),
                    mem:  toInt(widths[1].getValue(line)),
                    cpu:  parseFloat(widths[2].getValue(line))
                };
            }));
    });
};

function _getColumnWidthsLinux(line) {

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
            query: '%CPU',
            align: 'right'
        },
        {
            query: 'COMMAND',
            align: 'left'
        }
    ], line);
}
