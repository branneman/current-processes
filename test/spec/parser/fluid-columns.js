'use strict';

var os     = require('os');
var assert = require('chai').assert;
var rewire = require('rewire');

describe('Parser - FluidColumns', function() {

    it('should not fail when require()\'d', function() {

        var parserFluidColumns = require('../../../lib/parser/fluid-columns');

        assert(parserFluidColumns);
    });

    it('should be a function', function() {

        var parserFluidColumns = require('../../../lib/parser/fluid-columns');

        assert.isFunction(parserFluidColumns);
    });

    it('should invoke the callback function with the result', function(done) {

        var parserFluidColumns = require('../../../lib/parser/fluid-columns');
        var data =
            '  PID  RSS  VSZ %CPU COMMAND' + os.EOL +
            '    0    0    0  0.0 sched' + os.EOL +
            '    4    0    0  0.0 kcfpoold' + os.EOL +
            '    1 1320 2640  0.0 /sbin/init' + os.EOL +
            '    2    0    0  0.0 pageout' + os.EOL +
            '    3    0    0  0.1 fsflush';

        parserFluidColumns(data, function(err, processes) {

            assert.isNull(err);
            assert.isArray(processes);
            assert.lengthOf(processes, 5);
            done();
        });
    });

    it('should generate simplified process objects', function(done) {

        var parserFluidColumns = require('../../../lib/parser/fluid-columns');
        var data =
            '  PID  RSS  VSZ %CPU COMMAND' + os.EOL +
            '    0    0    0  0.0 sched' + os.EOL +
            '    4    0    0  0.0 kcfpoold' + os.EOL +
            '    1 1320 2640  0.0 /sbin/init' + os.EOL +
            '    2    0    0  0.0 pageout' + os.EOL +
            '    3    0    0  0.1 fsflush';

        parserFluidColumns(data, function(err, processes) {

            assert.lengthOf(processes, 5);

            processes.forEach(function(proc) {
                assert.property(proc, 'pid');
                assert.property(proc, 'name');
                assert.property(proc, 'cpu');
                assert.property(proc, 'pmem');
                assert.property(proc, 'vmem');
            });
            done();
        });
    });

    it('should generate a PID', function(done) {

        var parserFluidColumns = require('../../../lib/parser/fluid-columns');
        var data =
            '  PID  RSS  VSZ %CPU COMMAND' + os.EOL +
            '    2    0    0  0.0 pageout';

        parserFluidColumns(data, function(err, processes) {

            assert.lengthOf(processes, 1);
            assert.equal(processes[0].pid, 2);
            done();
        });
    });

    it('should generate a string name', function(done) {

        var parserFluidColumns = require('../../../lib/parser/fluid-columns');
        var data =
            '  PID  RSS  VSZ %CPU COMMAND' + os.EOL +
            '    4    0    0  0.0 kcfpoold' + os.EOL +
            '    1 1320 2640  0.0 /sbin/init' + os.EOL +
            '    3    0    0  0.1 fsflush';

        parserFluidColumns(data, function(err, processes) {

            assert.lengthOf(processes, 3);
            assert.isString(processes[0].name);
            done();
        });
    });

    it('should generate a cpu', function(done) {

        var parserFluidColumns = require('../../../lib/parser/fluid-columns');
        var data =
            '  PID  RSS  VSZ %CPU COMMAND' + os.EOL +
            '    0    0    0  0.1 sched' + os.EOL +
            '    4    0    0  0.1 kcfpoold' + os.EOL +
            '    1 1320 2640  0.1 /sbin/init' + os.EOL +
            '    2    0    0  0.1 pageout' + os.EOL +
            '    3    0    0  0.1 fsflush';

        parserFluidColumns(data, function(err, processes) {

            assert.lengthOf(processes, 5);
            assert.equal(processes[0].cpu, '0.1');
            done();
        });
    });

    it('should generate a pmem', function(done) {

        var parserFluidColumns = require('../../../lib/parser/fluid-columns');
        var data =
            '  PID  RSS  VSZ %CPU COMMAND' + os.EOL +
            '    1 1320 2640  0.0 /sbin/init';

        parserFluidColumns(data, function(err, processes) {

            assert.lengthOf(processes, 1);
            assert.equal(processes[0].pmem, 1320 * 1024);
            done();
        });
    });

    it('should generate a vmem', function(done) {

        var parserFluidColumns = require('../../../lib/parser/fluid-columns');
        var data =
            '  PID  RSS  VSZ %CPU COMMAND' + os.EOL +
            '    1 1320 2640  0.0 /sbin/init';

        parserFluidColumns(data, function(err, processes) {

            assert.lengthOf(processes, 1);
            assert.equal(processes[0].vmem, 2640 * 1024);
            done();
        });
    });

    it('should skip non-data lines', function(done) {

        var parserFluidColumns = require('../../../lib/parser/fluid-columns');
        var data =
            os.EOL +
            '  PID  RSS  VSZ %CPU COMMAND' + os.EOL +
            '    0    0    0  0.0 sched' + os.EOL +
            '    1 1320 2640  0.0 /sbin/init' + os.EOL +
            '    3    0    0  0.1 fsflush' + os.EOL + os.EOL;

        parserFluidColumns(data, function(err, processes) {

            assert.lengthOf(processes, 3);
            done();
        });
    });

    describe('_splitLimit()', function() {

        var parserFluidColumns = rewire('../../../lib/parser/fluid-columns');
        var _splitLimit = parserFluidColumns.__get__('_splitLimit');

        it('should always return an array', function() {

            var string = 'Split this, but not this';
            var limit  = 3;

            var result = _splitLimit(string, limit);

            assert.isArray(result);
        });

        it('should never return more array items than the limit', function() {

            var string = 'Split this, but not this';
            var limit  = 3;

            var result = _splitLimit(string, limit);

            assert.lengthOf(result, limit);
        });

        it('should handle multiple spaces', function() {

            var string = '716 6128  0.0 /usr/lib/spotify webhelper';
            var limit  = 4;

            var result = _splitLimit(string, limit);

            assert.lengthOf(result, limit);
            assert.equal(result[3], '/usr/lib/spotify webhelper');
        });
    });
});
