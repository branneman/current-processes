'use strict';

var assert = require('chai').assert;

var fixtures = require('../fixtures/string-helper/inferColumnWidths');

var inferColumnWidths = require('../../lib/string-helper').inferColumnWidths;

describe('StringHelper', function() {

    describe('.inferColumnWidths()', function() {

        it('should augment the columns with a pos{start,length} object', function() {

            var string  = fixtures[0].string;
            var columns = fixtures[0].columns;

            var result = inferColumnWidths(columns, string);

            result.forEach(function(col) {

                assert.isObject(col.pos, '`pos` is not an object');
                assert.isNumber(col.pos.start, '`pos.start` is not a number');

                if (col.pos.length !== undefined) {
                    assert.isNumber(col.pos.length, '`pos.length` is not a number');
                }
            });
        });

        it('should augment the columns with a getValue() method', function() {

            var string = fixtures[1].string;
            var columns = fixtures[1].columns;

            var result = inferColumnWidths(columns, string);

            result.forEach(function(col) {
                assert.isFunction(col.getValue);
            });
        });

        it('should return the right position values', function() {

            fixtures.forEach(function(fixture, fixtureIndex) {

                var result = inferColumnWidths(fixture.columns, fixture.string);

                fixture.expect.forEach(function(expect, columnIndex) {

                    var errMsg = 'At fixture ' + fixtureIndex + ', column ' + fixture.columns[columnIndex].query + ': ';
                    var getValue = ', getValue() would return \'' + result[columnIndex].getValue(fixture.string) + '\'';

                    assert.equal(result[columnIndex].pos.start,  expect.start,  errMsg + 'incorrect `start`' + getValue);
                    assert.equal(result[columnIndex].pos.length, expect.length, errMsg + 'incorrect `length`' + getValue);
                });
            });
        });
    });
});
