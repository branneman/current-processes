'use strict';

var assert = require('chai').assert;

var CurrentProcesses;

describe('Integration tests (for current platform)', function() {

    it('should not fail when require()\'d', function() {
        CurrentProcesses = require('../../current-processes');
        assert(CurrentProcesses);
    });

    it('should have a get() method', function() {
        assert.isFunction(CurrentProcesses.get);
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
    });
});
