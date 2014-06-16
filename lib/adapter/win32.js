'use strict';

var exec = require('child_process').exec;
var csv  = require('csv-parse');

module.exports.get = function getCurrentProcessesWin32(cb) {

    exec('tasklist /v /fo csv', function(err, stdout) {

        // Bail out on error
        if (err) {
            return cb('Command `tasklist` returned an error!');
        }

        csv(stdout, {}, function(err, lines) {

            cb(null, lines
                .filter(function(line, index) {
                    return index > 0;
                })
                .map(function(line) {
                    return {
                        pid:  parseInt(line[1], 10),
                        name: line[0],
                        mem:  _parseMemoryUsage(line[4])
                    };
                }));
        });
    });
};

// CpuUsage % = (TotalProcessRuntime / CpuTime) / 100

function _parseMemoryUsage(str) {
    return parseInt(str.substring(0, str.length - 2).replace('.', ''), 10);
}
