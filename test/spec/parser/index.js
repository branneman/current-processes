'use strict';

var assert = require('chai').assert;
var rewire = require('rewire');

describe('Parser', function() {

    it('should not fail when require()\'d', function() {

        var Parser = require('../../../lib/parser');

        assert(Parser);
    });

    it('should have a get() method', function() {

        var Parser = require('../../../lib/parser');

        assert.isFunction(Parser.get);
    });

    it('should return the right module for each platform', function() {

        var fixtures = [
            {
                platform: 'darwin',
                function: 'parserFixedColumns'
            },
            {
                platform: 'freebsd',
                function: 'parserFixedColumns'
            },
            {
                platform: 'linux',
                function: 'parserFixedColumns'
            },
            {
                platform: 'sunos',
                function: 'parserFluidColumns'
            },
            {
                platform: 'win32',
                function: 'parserCSV'
            }
        ];

        fixtures.forEach(function(fixture) {

            var Parser = rewire('../../../lib/parser');
            Parser.__set__('platform', fixture.platform);

            var result = Parser.get();

            assert.equal(result.name, fixture.function);
        });
    });
});
