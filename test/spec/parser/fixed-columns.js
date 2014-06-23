'use strict';

var os     = require('os');
var assert = require('chai').assert;
var rewire = require('rewire');

describe('Parser - FixedColumns', function() {

    it('should not fail when require()\'d', function() {

        var parserFixedColumns = require('../../../lib/parser/fixed-columns');

        assert(parserFixedColumns);
    });

    it('should be a function', function() {

        var parserFixedColumns = require('../../../lib/parser/fixed-columns');

        assert.isFunction(parserFixedColumns);
    });

    it('should invoke the callback function with the result', function(done) {

        var parserFixedColumns = require('../../../lib/parser/fixed-columns');
        var data =
            '  PID  RSS  VSZ %CPU COMMAND' + os.EOL +
            '    0    0    0  0.0 sched' + os.EOL +
            '    4    0    0  0.0 kcfpoold' + os.EOL +
            '    1 1320 2640  0.0 /sbin/init' + os.EOL +
            '    2    0    0  0.0 pageout' + os.EOL +
            '    3    0    0  0.1 fsflush';

        parserFixedColumns(data, function(err, processes) {

            assert.isNull(err);
            assert.isArray(processes);
            assert.lengthOf(processes, 5);
            done();
        });
    });

    it('should generate simplified process objects', function(done) {

        var parserFixedColumns = require('../../../lib/parser/fixed-columns');
        var data =
            '  PID  RSS  VSZ %CPU COMM' + os.EOL +
            '    0    0    0  0.0 sched' + os.EOL +
            '    4    0    0  0.0 kcfpoold' + os.EOL +
            '    1 1320 2640  0.0 /sbin/init' + os.EOL +
            '    2    0    0  0.0 pageout' + os.EOL +
            '    3    0    0  0.1 fsflush';

        parserFixedColumns(data, function(err, processes) {

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

        var parserFixedColumns = require('../../../lib/parser/fixed-columns');
        var data =
            '  PID   RSS    VSZ %CPU COMMAND' + os.EOL +
            '  428   672  15408  0.1 upstart-file-br';

        parserFixedColumns(data, function(err, processes) {

            assert.lengthOf(processes, 1);
            assert.equal(processes[0].pid, 428);
            done();
        });
    });

    it('should generate a string name', function(done) {

        var parserFixedColumns = require('../../../lib/parser/fixed-columns');
        var data =
            '  PID  RSS  VSZ %CPU COMMAND' + os.EOL +
            '    4    0    0  0.0 kcfpoold' + os.EOL +
            '    1 1320 2640  0.0 /sbin/init' + os.EOL +
            '    3    0    0  0.1 fsflush';

        parserFixedColumns(data, function(err, processes) {

            assert.lengthOf(processes, 3);
            assert.isString(processes[0].name);
            done();
        });
    });

    it('should generate a cpu', function(done) {

        var parserFixedColumns = require('../../../lib/parser/fixed-columns');
        var data =
            '  PID  RSS  VSZ %CPU COMMAND' + os.EOL +
            '    0    0    0  0.1 sched' + os.EOL +
            '    4    0    0  0.1 kcfpoold' + os.EOL +
            '    1 1320 2640  0.1 /sbin/init' + os.EOL +
            '    2    0    0  0.1 pageout' + os.EOL +
            '    3    0    0  0.1 fsflush';

        parserFixedColumns(data, function(err, processes) {

            assert.lengthOf(processes, 5);
            assert.equal(processes[0].cpu, '0.1');
            done();
        });
    });

    it('should generate a pmem', function(done) {

        var parserFixedColumns = require('../../../lib/parser/fixed-columns');
        var data =
            '  PID  RSS  VSZ %CPU COMMAND' + os.EOL +
            '    1 1320 2640  0.0 /sbin/init';

        parserFixedColumns(data, function(err, processes) {

            assert.lengthOf(processes, 1);
            assert.equal(processes[0].pmem, 1320 * 1024);
            done();
        });
    });

    it('should generate a vmem', function(done) {

        var parserFixedColumns = require('../../../lib/parser/fixed-columns');
        var data =
            '  PID  RSS  VSZ %CPU COMMAND' + os.EOL +
            '    1 1320 2640  0.0 /sbin/init';

        parserFixedColumns(data, function(err, processes) {

            assert.lengthOf(processes, 1);
            assert.equal(processes[0].vmem, 2640 * 1024);
            done();
        });
    });

    it('should skip non-data lines', function(done) {

        var parserFixedColumns = require('../../../lib/parser/fixed-columns');
        var data =
            os.EOL +
            '  PID  RSS  VSZ %CPU COMMAND' + os.EOL +
            '    0    0    0  0.0 sched' + os.EOL +
            '    1 1320 2640  0.0 /sbin/init' + os.EOL +
            '    3    0    0  0.1 fsflush' + os.EOL + os.EOL;

        parserFixedColumns(data, function(err, processes) {

            assert.lengthOf(processes, 3);
            done();
        });
    });

    describe('_trimNewlines()', function() {

        var parserFixedColumns = rewire('../../../lib/parser/fixed-columns');
        var _trimNewlines = parserFixedColumns.__get__('_trimNewlines');

        it('should trim \\r and \\n newlines', function() {

            var str = '\r\nbla1 bla2  bla3 bla4\n\n';

            var result = _trimNewlines(str);

            assert.equal(result, 'bla1 bla2  bla3 bla4');
        });

        it('should leave newlines that are not at the beginning or end', function() {

            var str = '\nbla1 bla2\nbla3 bla4\n\n';

            var result = _trimNewlines(str);

            assert.equal(result, 'bla1 bla2\nbla3 bla4');
        });
    });

    describe('_inferColumnWidths()', function() {

        var fixtures = require('../../fixtures/datasource/fixed-columns/_inferColumnWidths');
        var parserFixedColumns = rewire('../../../lib/parser/fixed-columns');
        var _inferColumnWidths = parserFixedColumns.__get__('_inferColumnWidths');

        it('should augment the columns with a pos{start,length} object', function() {

            var string  = fixtures.correct[0].string;
            var columns = fixtures.correct[0].columns;

            var result = _inferColumnWidths(columns, string);

            result.forEach(function(col) {

                assert.isObject(col.pos, '`pos` is not an object');
                assert.isNumber(col.pos.start, '`pos.start` is not a number');

                if (col.pos.length !== undefined) {
                    assert.isNumber(col.pos.length, '`pos.length` is not a number');
                }
            });
        });

        it('should augment the columns with a getValue() method', function() {

            var string = fixtures.correct[1].string;
            var columns = fixtures.correct[1].columns;

            var result = _inferColumnWidths(columns, string);

            result.forEach(function(col) {
                assert.isFunction(col.getValue);
            });
        });

        it('should return the right position values', function() {

            fixtures.correct.forEach(function(fixture, fixtureIndex) {

                var result = _inferColumnWidths(fixture.columns, fixture.string);

                fixture.expect.forEach(function(expect, columnIndex) {

                    var errMsg = 'At fixture ' + fixtureIndex + ', column ' + fixture.columns[columnIndex].query + ': ';
                    var getValue = ', getValue() would return \'' + result[columnIndex].getValue(fixture.string) + '\'';

                    var pos = result[columnIndex].pos;
                    assert.equal(pos.start,  expect.start,  errMsg + 'incorrect `start`' + getValue);
                    assert.equal(pos.length, expect.length, errMsg + 'incorrect `length`' + getValue);
                });
            });
        });

        it('should throw when passed unsupported values', function() {

            fixtures.incorrect.forEach(function(fixture) {

                var fn = _inferColumnWidths.bind({}, fixture.columns, fixture.string);

                assert.throw(fn);
            });
        });
    });
});
