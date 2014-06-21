'use strict';

var exec = require('child_process').exec;

module.exports = function dataSourcePS(cb) {

    var cmd = 'ps -A -o pid,rss,vsz,pcpu,comm';

    exec(cmd, function(err, stdout) {
        if (err) {
            cb('Command `ps` returned an error!');
        } else {
            cb(null, stdout);
        }
    });
};
