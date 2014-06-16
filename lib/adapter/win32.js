'use strict';

var os    = require('os');
var exec  = require('child_process').exec;
var csv   = require('csv-parse');
var toInt = function(str) { return parseInt(str, 10) };

var inferColumnWidths = require('../string-helper').inferColumnWidths;

module.exports.get = function getCurrentProcessesWin32(cb) {

    var cmd = 'wmic path Win32_PerfFormattedData_PerfProc_Process get IDProcess,Name,PercentProcessorTime,WorkingSetPrivate';

    exec(cmd, function(err, stdout) {

        if (err) {
            return cb('Command `wmic` returned an error!');
        }

        var lines  = stdout.split(os.EOL);
        var widths = _getColumnWidths(lines[0]);

        csv(stdout, {}, function(err, lines) {

            cb(null, lines
                .filter(function(line, index) {
                    return index > 0;
                })
                .map(function(line) {
                    return {
                        pid:  toInt(widths[0].getValue(line)),
                        name: widths[1].getValue(line),
                        mem:  toInt(widths[3].getValue(line)),
                        cpu:  toInt(widths[2].getValue(line))
                    };
                })
                .filter(function(proc) {
                    return !!proc.pid;
                }));
        });
    });
};

function _getColumnWidths(line) {

    return inferColumnWidths([
        {
            query: 'IDProcess',
            align: 'left'
        },
        {
            query: 'Name',
            align: 'left'
        },
        {
            query: 'PercentProcessorTime',
            align: 'left'
        },
        {
            query: 'WorkingSetPrivate',
            align: 'left'
        }
    ], line);
}
