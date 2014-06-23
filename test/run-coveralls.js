'use strict';

var fs = require('fs');
var spawn = require('child_process').spawn;

if (!process.argv[2] || !fs.existsSync(process.argv[2]) ||
    !process.argv[3] || !fs.existsSync(process.argv[3])) {
    console.log('Synopsis: `node <this-file> <path-to-lcov.info> <path-to-coveralls.js>`');
    process.exit(-1);
}

var lcov = fs.createReadStream(process.argv[2], { encoding: 'utf8' });
var coveralls = spawn('node', [process.argv[3]]);

lcov.pipe(coveralls.stdin);
coveralls.stdout.pipe(process.stdout);
coveralls.stderr.pipe(process.stdout);
