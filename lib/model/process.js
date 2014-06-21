'use strict';

var totalmem = require('os').totalmem();

// Expose module
module.exports = Process;
module.exports.factory = processFactory;

//
// Model: Process
//
function Process(opt) {

    this.pid = opt.pid;

    this.name = opt.name.substr(opt.name.lastIndexOf('/') + 1);

    this.cpu = opt.cpu;

    this.mem = {
        private: opt.pmem,
        virtual: opt.vmem,
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
