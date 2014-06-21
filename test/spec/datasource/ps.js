'use strict';

var assert = require('chai').assert;
var rewire = require('rewire');

describe('DataSource - PS', function() {

    it('should not fail when require()\'d', function() {

        var dataSourcePS = require('../../../lib/datasource/ps');

        assert(dataSourcePS);
        assert.isFunction(dataSourcePS);
    });

    it('should invoke the callback function with the result', function(done) {

        var dataSourcePS = rewire('../../../lib/datasource/ps');

        dataSourcePS.__set__('exec', function(cmd, cb) {
            cb(null, 'FAKE RESULT');
        });

        dataSourcePS(function(err, result) {
            assert.isNull(err);
            assert.equal(result, 'FAKE RESULT');
            done();
        });
    });

    it('should fail by invoking the callback function', function(done) {

        var dataSourcePS = rewire('../../../lib/datasource/ps');

        dataSourcePS.__set__('exec', function(cmd, cb) {
            cb('FAKE ERROR');
        });

        dataSourcePS(function(err, result) {
            assert.isString(err);
            assert.isUndefined(result);
            done();
        });
    });
});
