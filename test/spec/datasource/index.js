'use strict';

var assert = require('chai').assert;
var rewire = require('rewire');

describe('DataSource', function() {

    it('should not fail when require()\'d', function() {

        var DataSource = require('../../../lib/datasource');

        assert(DataSource);
    });

    it('should have a get() method', function() {

        var DataSource = require('../../../lib/datasource');

        assert.isFunction(DataSource.get);
    });

    it('should return the right module for each platform', function() {

        var fixtures = [
            {
                platform: 'darwin',
                function: 'dataSourcePS'
            },
            {
                platform: 'freebsd',
                function: 'dataSourcePS'
            },
            {
                platform: 'linux',
                function: 'dataSourcePS'
            },
            {
                platform: 'sunos',
                function: 'dataSourcePS'
            },
            {
                platform: 'win32',
                function: 'dataSourceWMIC'
            }
        ];

        fixtures.forEach(function(fixture) {

            var DataSource = rewire('../../../lib/datasource');
            DataSource.__set__('platform', fixture.platform);

            var result = DataSource.get();

            assert.equal(result.name, fixture.function);
        });
    });
});
