'use strict';

var os    = require('os');
var exec  = require('child_process').exec;
var csv   = require('csv-parse');
var toInt = function(str) { return parseInt(str, 10) };

module.exports.get = function getCurrentProcessesWin32(cb) {

    var cmd = 'wmic path Win32_PerfFormattedData_PerfProc_Process get IDProcess,Name,PercentProcessorTime,PrivateBytes,VirtualBytes /format:csv';

    exec(cmd, function(err, stdout) {

        if (err) {
            return cb('Command `wmic` returned an error!');
        }

        csv(stdout, {rowDelimiter: os.EOL}, function(err, lines) {

            var totalmem = os.totalmem();

            cb(null, lines
                .filter(function(line, index) {
                    return index > 0 && line.length === 6;
                })
                .map(function(line) {
                    return {
                        pid: toInt(line[1]),
                        name: _getProcessName(line[2]),
                        mem: {
                            virtual: toInt(line[5]),
                            private: toInt(line[4]),
                            percentage: toInt(line[4]) / totalmem * 100
                        },
                        cpu: toInt(line[3])
                    };
                })
                .filter(function(proc) {
                    return !!proc.pid;
                }));
        });
    });
};

function _getProcessName(name) {

    var pos = name.indexOf('#');
    if (~pos) {
        return name.substr(0, pos);
    } else {
        return name;
    }
}
