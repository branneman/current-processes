'use strict';

var os    = require('os');
var exec  = require('child_process').exec;
var toInt = function(str) { return parseInt(str, 10); };

var inferColumnWidths = require('../string-helper').inferColumnWidths;

module.exports.get = function getCurrentProcessesLinux(cb, _getColumnWidths) {

    var cmd = 'ps -A -o pid,rss,vsz,pcpu,comm';

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

        var totalmem = os.totalmem();

        cb(null, lines
            .filter(function(line, index) {
                return line && index >= 1;
            })
            .map(function(line) {
                var pmem = toInt(widths[1].getValue(line));
                return {
                    pid: toInt(widths[0].getValue(line)),
                    name: widths[4].getValue(line),
                    mem: {
                        private: pmem,
                        virtual: toInt(widths[2].getValue(line)),
                        usage: pmem / totalmem * 100
                    },
                    cpu: parseFloat(widths[3].getValue(line))
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
            query: 'COMMAND',
            align: 'left'
        }
    ], line);
}
