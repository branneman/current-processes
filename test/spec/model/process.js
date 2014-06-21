'use strict';

var assert = require('chai').assert;
var rewire = require('rewire');

describe('Process', function() {

    it('should not fail when require()\'d', function() {

        var Process = require('../../../lib/model/process');

        assert(Process);
    });

    it('should be a function', function() {

        var Process = require('../../../lib/model/process');

        assert.isFunction(Process);
    });

    it('should have a PID', function() {

        var Process = require('../../../lib/model/process');
        var opt = { pid: 1337, name: '', cpu: 1, pmem: 2, vmem: 3 };

        var proc = new Process(opt);

        assert.isNumber(proc.pid);
        assert.equal(proc.pid, opt.pid);
    });

    it('should have a formatted name', function() {

        var Process = require('../../../lib/model/process');
        var fixtures = [
            { pid: 1, name: 'noot',      cpu: 2, pmem: 3, vmem: 4 },
            { pid: 1, name: 'aap/noot',  cpu: 2, pmem: 3, vmem: 4 },
            { pid: 1, name: '/aap/noot', cpu: 2, pmem: 3, vmem: 4 }
        ];

        fixtures.forEach(function(fixture) {

            var proc = new Process(fixture);

            assert.isString(proc.name);
            assert.equal(proc.name, 'noot');
        });
    });

    it('should have cpu usage', function() {

        var Process = require('../../../lib/model/process');
        var opt = { pid: 1, name: '', cpu: 2.5, pmem: 2, vmem: 3 };

        var proc = new Process(opt);

        assert.isNumber(proc.cpu);
        assert.equal(proc.cpu, opt.cpu);
    });

    it('should have private and virtual memory', function() {

        var Process = require('../../../lib/model/process');
        var opt = { pid: 1, name: '', cpu: 2.5, pmem: 2, vmem: 3 };

        var proc = new Process(opt);

        assert.isObject(proc.mem);
        assert.isNumber(proc.mem.private);
        assert.isNumber(proc.mem.virtual);

        assert.equal(proc.mem.private, opt.pmem);
        assert.equal(proc.mem.virtual, opt.vmem);
    });

    it('should calculate correct memory usage', function() {

        var Process = rewire('../../../lib/model/process');
        Process.__set__('totalmem', 12);
        var opt = { pid: 1, name: '', cpu: 2, pmem: 3, vmem: 4 };

        var proc = new Process(opt);

        assert.isNumber(proc.mem.usage);
        assert.equal(proc.mem.usage, 25); // result = pmem / totalmem * 100
    });

    describe('processFactory', function() {

        it('should be a function', function() {

            var processFactory = require('../../../lib/model/process').factory;

            assert.isFunction(processFactory);
        });

        it('should invoke the callback function with the result', function(done) {

            var processFactory = require('../../../lib/model/process').factory;
            var data = [{ pid: 1, name: '', cpu: 2, pmem: 3, vmem: 4 }];

            processFactory(data, function(err, processes) {
                assert.isArray(processes);
                done();
            });
        });
    });
});
