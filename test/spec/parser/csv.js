'use strict';

var os     = require('os');
var assert = require('chai').assert;

describe('Parser - CSV', function() {

    it('should not fail when require()\'d', function() {

        var parserCSV = require('../../../lib/parser/csv');

        assert(parserCSV);
    });

    it('should be a function', function() {

        var parserCSV = require('../../../lib/parser/csv');

        assert.isFunction(parserCSV);
    });

    it('should invoke the callback function with the result', function(done) {

        var parserCSV = require('../../../lib/parser/csv');
        var data =
            'Node,IDProcess,Name,PercentProcessorTime,PrivateBytes,VirtualBytes' + os.EOL +
            'COMPUTERNAME,3308,chrome#1,0,126222336,419917824';

        parserCSV(data, function(err, processes) {

            assert.isNull(err);
            assert.isArray(processes);
            assert.lengthOf(processes, 1);
            done();
        });
    });

    it('should generate simplified process objects', function(done) {

        var parserCSV = require('../../../lib/parser/csv');
        var data =
            'Node,IDProcess,Name,PercentProcessorTime,PrivateBytes,VirtualBytes' + os.EOL +
            'COMPUTERNAME,0,_Total,100,9190395904,46864580607' + os.EOL +
            'COMPUTERNAME,3308,chrome#1,0,126222336,419917824' + os.EOL +
            'COMPUTERNAME,15752,chrome#20,0,33488896,217202688';

        parserCSV(data, function(err, processes) {

            assert.lengthOf(processes, 2);

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

        var parserCSV = require('../../../lib/parser/csv');
        var data =
            'Node,IDProcess,Name,PercentProcessorTime,PrivateBytes,VirtualBytes' + os.EOL +
            'COMPUTERNAME,0,_Total,100,9190395904,46864580607' + os.EOL +
            'COMPUTERNAME,3308,chrome#1,0,126222336,419917824';

        parserCSV(data, function(err, processes) {

            assert.lengthOf(processes, 1);
            assert.equal(processes[0].pid, 3308);
            done();
        });
    });

    it('should skip a PID of zero', function(done) {

        var parserCSV = require('../../../lib/parser/csv');
        var data =
            'Node,IDProcess,Name,PercentProcessorTime,PrivateBytes,VirtualBytes' + os.EOL +
            'COMPUTERNAME,0,_Total,100,9190395904,46864580607' + os.EOL +
            'COMPUTERNAME,3308,chrome#1,0,126222336,419917824' + os.EOL +
            'COMPUTERNAME,15752,chrome#20,0,33488896,217202688' + os.EOL +
            'COMPUTERNAME,0,Idle,100,0,65536';

        parserCSV(data, function(err, processes) {

            assert.lengthOf(processes, 2);
            done();
        });
    });

    it('should generate a string name', function(done) {

        var parserCSV = require('../../../lib/parser/csv');
        var data =
            'Node,IDProcess,Name,PercentProcessorTime,PrivateBytes,VirtualBytes' + os.EOL +
            'COMPUTERNAME,0,_Total,100,9190395904,46864580607' + os.EOL +
            'COMPUTERNAME,3308,chrome,0,126222336,419917824';

        parserCSV(data, function(err, processes) {

            assert.lengthOf(processes, 1);
            assert.isString(processes[0].name);
            done();
        });
    });

    it('should generate a cpu', function(done) {

        var parserCSV = require('../../../lib/parser/csv');
        var data =
            'Node,IDProcess,Name,PercentProcessorTime,PrivateBytes,VirtualBytes' + os.EOL +
            'COMPUTERNAME,0,_Total,100,9190395904,46864580607' + os.EOL +
            'COMPUTERNAME,3308,chrome#1,25,126222336,419917824';

        parserCSV(data, function(err, processes) {

            assert.lengthOf(processes, 1);
            assert.equal(processes[0].cpu, 25);
            done();
        });
    });

    it('should generate a pmem', function(done) {

        var parserCSV = require('../../../lib/parser/csv');
        var data =
            'Node,IDProcess,Name,PercentProcessorTime,PrivateBytes,VirtualBytes' + os.EOL +
            'COMPUTERNAME,0,_Total,100,9190395904,46864580607' + os.EOL +
            'COMPUTERNAME,3308,chrome#1,0,126222336,419917824';

        parserCSV(data, function(err, processes) {

            assert.lengthOf(processes, 1);
            assert.equal(processes[0].pmem, 126222336);
            done();
        });
    });

    it('should generate a vmem', function(done) {

        var parserCSV = require('../../../lib/parser/csv');
        var data =
            'Node,IDProcess,Name,PercentProcessorTime,PrivateBytes,VirtualBytes' + os.EOL +
            'COMPUTERNAME,0,_Total,100,9190395904,46864580607' + os.EOL +
            'COMPUTERNAME,3308,chrome#1,0,126222336,419917824';

        parserCSV(data, function(err, processes) {

            assert.lengthOf(processes, 1);
            assert.equal(processes[0].vmem, 419917824);
            done();
        });
    });

    it('should skip non-data lines', function(done) {

        var parserCSV = require('../../../lib/parser/csv');
        var data =
            os.EOL +
            'Node,IDProcess,Name,PercentProcessorTime,PrivateBytes,VirtualBytes' + os.EOL +
            'COMPUTERNAME,0,_Total,100,9190395904,46864580607' + os.EOL +
            'COMPUTERNAME,15752,chrome#20,0,33488896,217202688' + os.EOL +
            'COMPUTERNAME,0,Idle,100,0,65536' + os.EOL + os.EOL;

        parserCSV(data, function(err, processes) {

            assert.lengthOf(processes, 1);
            done();
        });
    });

    it('should strip the process name of a postfixed id', function(done) {

        var parserCSV = require('../../../lib/parser/csv');
        var data =
            'Node,IDProcess,Name,PercentProcessorTime,PrivateBytes,VirtualBytes' + os.EOL +
            'COMPUTERNAME,0,_Total,100,9190395904,46864580607' + os.EOL +
            'COMPUTERNAME,15752,chrome#13,0,33488896,217202688' + os.EOL +
            'COMPUTERNAME,3308,chrome#37,0,126222336,419917824';

        parserCSV(data, function(err, processes) {

            assert.lengthOf(processes, 2);
            assert.isString(processes[0].name);
            assert.equal(processes[0].name, 'chrome');
            done();
        });
    });
});
