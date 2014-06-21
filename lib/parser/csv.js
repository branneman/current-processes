'use strict';

var os  = require('os');
var csv = require('csv-parse');

module.exports = function parserCSV(data, cb) {

    csv(data, { rowDelimiter: os.EOL }, function(err, lines) {

        cb(null, lines
            .filter(function(line, index) {
                return index > 0 && line.length === 6;
            })
            .map(function(line) {
                return {
                    pid:  parseInt(line[1], 10),
                    name: _getProcessName(line[2]),
                    cpu:  parseInt(line[3], 10),
                    pmem: parseInt(line[4], 10),
                    vmem: parseInt(line[5], 10)
                };
            })
            .filter(function(proc) {
                return !!proc.pid;
            }));
    });
};

//
// Strip the optional postfixed #<ID>
//
function _getProcessName(name) {

    var pos = name.indexOf('#');
    if (~pos) {
        return name.substr(0, pos);
    } else {
        return name;
    }
}
