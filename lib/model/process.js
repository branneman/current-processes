'use strict';

var totalmem = require('os').totalmem();

// Expose module
module.exports = Process;
module.exports.factory = processFactory;

//
// Model: Process
//
function Process(opt) {

    this.pid = parseInt(opt.pid, 10);

    this.name = opt.name.substr(opt.name.lastIndexOf('/') + 1);

    this.cpu = parseFloat(opt.cpu);

    this.mem = {
        private: parseInt(opt.pmem, 10),
        virtual: parseInt(opt.vmem, 10),
        usage: opt.pmem / totalmem * 100
    };
}

//
// Factory method
//
function processFactory(data, cb) {

    cb(null, data.map(function(opt) {
        return new Process(opt);
    }));
}
