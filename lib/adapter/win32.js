'use strict';

var os = require('os');
var exec = require('child_process').exec;

module.exports.get = function getCurrentProcessesWin32(cb) {

    exec('tasklist', function(err, stdout) {

        // Bail out on error
        if (err) {
            return cb('Command `tasklist` returned an error!');
        }

        var lines  = stdout.split(os.EOL);
        var widths = _getColumnWidth(lines[2]);

        cb(null, lines
            .filter(function(line, index) {
                return line && index >= 3;
            })
            .map(function(line) {
                return {
                    pid:  parseInt(_getColumnValue(line, widths, 1), 10),
                    name: _getColumnValue(line, widths, 0),
                    mem:  _parseMemoryUsage(_getColumnValue(line, widths, 4))
                };
        }));
    });
};

function _getColumnWidth(line) {

    return line
        .split(' ')
        .map(function(column) {
            return column.length;
        });

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
