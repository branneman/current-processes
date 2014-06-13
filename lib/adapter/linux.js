'use strict';

var os = require('os');
var exec = require('child_process').exec;

module.exports.get = function getCurrentProcessesLinux(cb) {

    exec('ps -A -o pid,vsz,comm', function(err, stdout) {

        // Bail out on error
        if (err) {
            return cb('Command `ps` returned an error!');
        }

        var lines  = stdout.split(os.EOL);
        var widths = _getColumnWidth(lines[0]);

        cb(null, lines
            .filter(function(line, index) {
                return line && index >= 1;
            })
            .map(function(line) {
                return {
                    pid:  parseInt(_getColumnValue(line, widths, 0), 10),
                    name: _getColumnValue(line, widths, 2),
                    mem:  _parseMemoryUsage(_getColumnValue(line, widths, 1))
                };
            }));
    });
};

function _getColumnWidth(line) {

    var ln1 = 0;
    var ln2 = line.indexOf('PID') + 4; // 4 = 'PID '.length
    var ln3 = line.indexOf('COMMAND');

    return [ln1, ln2, ln3];
}

function _getColumnValue(line, widths, column) {

    var start = 0;
    for (var i = 0; i < column; i++) {
        start += widths[i] + 1;
    }

    var length = widths[column];

    return line.substr(start, length).trim();
}

function _parseMemoryUsage(str) {
    return parseInt(str.substring(0, str.length - 2).replace('.', ''), 10);
}
