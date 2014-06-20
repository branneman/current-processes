'use strict';

var assert = require('chai').assert;

var fixtures = require('../fixtures/string-helper/inferColumnWidths');

var StringHelper = require('../../lib/string-helper');

describe('StringHelper', function() {

    describe('.splitLimit()', function() {

        it('should always return an array', function() {

            var string = 'Split this, but not this';
            var limit  = 3;

            var result = StringHelper.splitLimit(string, limit);

            assert.isArray(result);
        });

        it('should never return more array items than the limit', function() {

            var string = 'Split this, but not this';
            var limit  = 3;

            var result = StringHelper.splitLimit(string, limit);

            assert.lengthOf(result, limit);
        });

        it('should handle multiple spaces', function() {

            var string = '716 6128  0.0 /usr/lib/spotify webhelper';
            var limit  = 4;

            var result = StringHelper.splitLimit(string, limit);

            assert.lengthOf(result, limit);
            assert.equal(result[3], '/usr/lib/spotify webhelper');
        });
    });

    describe('.inferColumnWidths()', function() {

        it('should augment the columns with a pos{start,length} object', function() {

            var string  = fixtures.correct[0].string;
            var columns = fixtures.correct[0].columns;

            var result = StringHelper.inferColumnWidths(columns, string);

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

            var result = StringHelper.inferColumnWidths(columns, string);

            result.forEach(function(col) {
                assert.isFunction(col.getValue);
            });
        });

        it('should return the right position values', function() {

            fixtures.correct.forEach(function(fixture, fixtureIndex) {

                var result = StringHelper.inferColumnWidths(fixture.columns, fixture.string);

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

                var fn = StringHelper.inferColumnWidths.bind({}, fixture.columns, fixture.string);

                assert.throw(fn);
            });
        });
    });
});
