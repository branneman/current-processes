'use strict';

var os  = require('os');
var csv = require('csv-parse');

module.exports = function parserCSV(data, cb) {

    csv(data.trim(), { rowDelimiter: os.EOL }, function(err, lines) {

        cb(null, lines
            .filter(function(line, index) {
                return index > 0 && line.length === 6;
            })
            .map(function(line) {
                return {
                    pid:  line[1],
                    name: _getProcessName(line[2]),
                    cpu:  line[3],
                    pmem: line[4],
                    vmem: line[5]
                };
            })
            .filter(function(proc) {
                return proc.pid !== '0' && proc.pid !== 0;
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
