'use strict';

var exec = require('child_process').exec;

module.exports = function dataSourceWMIC(cb) {

    var cols = 'IDProcess,Name,PercentProcessorTime,PrivateBytes,VirtualBytes';
    var cmd  = 'wmic path Win32_PerfFormattedData_PerfProc_Process get ' + cols + ' /format:csv';

    exec(cmd, function(err, stdout) {
        if (err) {
            cb('Command `wmic` returned an error!');
        } else {
            cb(null, stdout);
        }
    });
};
