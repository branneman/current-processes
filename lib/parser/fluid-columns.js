'use strict';

var os = require('os');

module.exports = function parserFluidColumns(data, cb) {

    var lines = data.trim().split(os.EOL);

    cb(null, lines
        .filter(function(line, index) {
            return line && index >= 1;
        })
        .map(function(line) {
            return _splitLimit(line.trim(), 5);
        })
        .map(function(proc) {
            return {
                pid:  proc[0],
                name: proc[4],
                cpu:  proc[3],
                pmem: parseInt(proc[1], 10) * 1024,
                vmem: parseInt(proc[2], 10) * 1024
            };
        }));
};

//
// String helper which implements a split() method with a limit,
//  it differs from JS' String.split() because it concats the remaining string
//
function _splitLimit(string, limit) {

    var arr = string.split(/\s+/);
    var result = arr.splice(0, limit - 1);

    result.push(arr.join(' '));

    return result;
}
