'use strict';

var assert = require('assert');

var CurrentProcesses;

describe('Current Processes', function() {

    describe('Integration tests', function() {

        it('should not fail when require()\'d', function() {
            CurrentProcesses = require('../../current-processes.js');
            assert(CurrentProcesses);
        });

        it('should have a get() method', function() {
            var isFunction = typeof CurrentProcesses.get === 'function';
            assert(isFunction);
        });
    });

    describe('Method get()', function() {

        it('should return an array', function(done) {

            CurrentProcesses.get(function(err, processes) {

                if (err) {
                    assert.fail(err);
                    return done();
                }

                assert(Array.isArray(processes));
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
                    var isNumber = typeof proc.pid === 'number';
                    assert(isNumber, 'PID is not a number: ' + proc.pid);

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
                    var isString = typeof proc.name === 'string';
                    assert(isString);
                });
                done();
            });
        });

        it('should include the process memory usage', function(done) {

            CurrentProcesses.get(function(err, processes) {

                if (err) {
                    assert.fail(err);
                    return done();
                }

                processes.forEach(function(proc) {
                    var isNumber = typeof proc.mem === 'number';
                    assert(isNumber, 'Memory is not a number: ' + proc.mem);

                    var isInt = proc.mem % 1 === 0;
                    assert(isInt, 'Memory is not an integer: ' + proc.mem);
                });
                done();
            });
        });
    });
});
