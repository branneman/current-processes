'use strict';

var assert = require('chai').assert;
var rewire = require('rewire');

describe('DataSource - WMIC', function() {

    it('should not fail when require()\'d', function() {

        var dataSourceWMIC = require('../../../lib/datasource/wmic');

        assert(dataSourceWMIC);
        assert.isFunction(dataSourceWMIC);
    });

    it('should invoke the callback function with the result', function(done) {

        var dataSourceWMIC = rewire('../../../lib/datasource/wmic');

        dataSourceWMIC.__set__('exec', function(cmd, cb) {
            cb(null, 'FAKE RESULT');
        });

        dataSourceWMIC(function(err, result) {
            assert.isNull(err);
            assert.equal(result, 'FAKE RESULT');
            done();
        });
    });

    it('should fail by invoking the callback function', function(done) {

        var dataSourceWMIC = rewire('../../../lib/datasource/wmic');

        dataSourceWMIC.__set__('exec', function(cmd, cb) {
            cb('FAKE ERROR');
        });

        dataSourceWMIC(function(err, result) {
            assert.isString(err);
            assert.isUndefined(result);
            done();
        });
    });
});
