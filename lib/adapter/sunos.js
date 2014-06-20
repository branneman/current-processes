'use strict';

var os    = require('os');
var exec  = require('child_process').exec;
var toInt = function(str) { return parseInt(str, 10) };

var splitLimit = require('../../lib/string-helper').splitLimit;

module.exports.get = function getCurrentProcessesSunOS(cb) {

    var cmd = 'ps -A -o pid,rss,vsz,pcpu,comm';

    exec(cmd, function(err, stdout) {

        if (err) {
            return cb('Command `ps` returned an error!');
        }

        var lines = stdout.split(os.EOL);

        var totalmem = os.totalmem();

        cb(null, lines
            .filter(function(line, index) {
                return line && index >= 1;
            })
            .map(function(line) {
                return splitLimit(line.trim(), 4);
            })
            .map(function(proc) {
                var pmem = toInt(proc[1]);
                return {
                    pid: toInt(proc[0]),
                    name: proc[4],
                    mem: {
                        virtual: toInt(proc[2]),
                        private: pmem,
                        percentage: pmem / totalmem * 100
                    },
                    cpu: parseFloat(proc[3])
                };
            })
            .map(function(proc) {
                // Shorten path to only the executable
                proc.name = proc.name.substr(proc.name.lastIndexOf('/') + 1);
                return proc;
            }));
    });
};
