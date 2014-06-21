'use strict';

var assert = require('chai').assert;
var rewire = require('rewire');

var CurrentProcesses;

describe('Current Processes', function() {

    describe('Exports', function() {

        it('should not fail when require()\'d', function() {
            CurrentProcesses = require('../../current-processes');
            assert(CurrentProcesses);
        });

        it('should have a get() method', function() {
            assert.isFunction(CurrentProcesses.get);
        });
    });

    describe('Method get()', function() {

        // WMIC can take a while to start up for the first time
        this.timeout(15000);

        it('should return an array', function(done) {

            CurrentProcesses.get(function(err, processes) {

                if (err) {
                    assert.fail(err);
                    return done();
                }

                assert.isArray(processes);
                done();
            });
        });

        it('should never return an empty array', function(done) {

            CurrentProcesses.get(function(err, processes) {

                if (err) {
                    assert.fail(err);
                    return done();
                }

                assert(processes.length);
                done();
            });
        });

        it('should include the process PID', function(done) {

            CurrentProcesses.get(function(err, processes) {

                if (err) {
                    assert.fail(err);
                    return done();
                }

                processes.forEach(function(proc) {
                    assert.isNumber(proc.pid);
                    var isInt = proc.pid % 1 === 0;
                    assert(isInt, 'PID is not an integer:' + proc.pid);
                });
                done();
            });
        });

        it('should include the process name', function(done) {

            CurrentProcesses.get(function(err, processes) {

                if (err) {
                    assert.fail(err);
                    return done();
                }

                processes.forEach(function(proc) {
                    assert.isString(proc.name);
                });
                done();
            });
        });

        it('should include the 3 types of process memory usage', function(done) {

            CurrentProcesses.get(function(err, processes) {

                if (err) {
                    assert.fail(err);
                    return done();
                }

                processes.forEach(function(proc) {
                    assert.isObject(proc.mem);
                    assert.isNumber(proc.mem.private);
                    assert.isNumber(proc.mem.virtual);
                    assert.isNumber(proc.mem.usage);
                });
                done();
            });
        });

        it('should include the process cpu usage', function(done) {

            CurrentProcesses.get(function(err, processes) {

                if (err) {
                    assert.fail(err);
                    return done();
                }

                processes.forEach(function(proc) {
                    assert.isNumber(proc.cpu);
                });
                done();
            });
        });

        xit('should return an error if `ps` or `wmic` failed', function(done) {

            // @todo Temporary hack to make this test realistic
            var platform = (process.platform === 'freebsd' ? 'linux' : process.platform);

            // Stub child_process.exec() with a failing variant
            var CurrentProcesses = rewire('../../lib/adapter/' + platform);
            CurrentProcesses.__set__('exec', function(cmd, cb) {
                setTimeout(function() {
                    cb('Fake error!');
                }, 100);
            });

            CurrentProcesses.get(function(err, processes) {
                assert.isString(err);
                assert.isUndefined(processes);
                done();
            });
        });
    });
});
