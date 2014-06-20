/* jshint -W071 */

'use strict';

/**
 * String helper which implements a split() method with a limit,
 *  it differs from JS' String.split() because it concats the remaining string
 *
 *  splitLimit('Split this, but not this', 3);
 *  returns: ['Split', 'this,', 'but not this']
 */
module.exports.splitLimit = function(string, limit) {

    var arr = string.split(/\s+/);
    var result = arr.splice(0, limit - 1);

    result.push(arr.join(' '));

    return result;
};

/**
 * String helper for parsing a column-based text output, like from:
 *   `ps -A -o pid,vsz,comm`
 *
 * @param columns e.g.
 *   [
 *       {
 *           query: 'PID',
 *           align: 'right'
 *       },
 *       {
 *           query: 'VSZ',
 *           align: 'right'
 *       },
 *       {
 *           query: 'COMMAND',
 *           align: 'left'
 *       }
 *   ]
 * @param string e.g. '  PID    VSZ COMMAND'
 *
 * @returns The given columns object, enhanced with getValue(str) method
 */
module.exports.inferColumnWidths = function inferColumnWidths(columns, string) {

    var i, nextColumn;
    var len = columns.length;
    var last = len - 1;

    //
    // Pass 1: Start with header positions
    //
    for (i = 0; i < len; i++) {
        columns[i].pos = {
            start:  string.indexOf(columns[i].query),
            length: columns[i].query.length
        };
    }

    //
    // Pass 2: Fix alignments
    //
    for (i = 0; i < len; i++) {

        // First column
        if (i === 0) {

            if (columns[i].align === 'left') {
                nextColumn = columns[i + 1].pos;
                columns[i].pos.length = (nextColumn.start - columns[i].pos.start);
            }

            else if (columns[i].align === 'right') {
                columns[i].pos.length += columns[i].pos.start;
            }

            else {
                throw 'StringHelper.inferColumnWidths `align` has incorrect value, valid options: left, right';
            }

            columns[i].pos.start = 0;
        }

        // Middle column
        else if (i < last) {

            if (columns[i].align === 'left') {
                nextColumn = columns[i + 1].pos;
                columns[i].pos.length = (nextColumn.start - columns[i].pos.start);
            }

            else if (columns[i].align === 'right') {

                var previousColumn      = columns[i - 1].pos;
                var currentEndPosition  = (columns[i].pos.start + columns[i].pos.length);
                var previousEndPosition = (previousColumn.start + previousColumn.length);

                columns[i].pos.length = currentEndPosition - previousEndPosition;
                columns[i].pos.start  = previousEndPosition;
            }

            else {
                throw 'StringHelper.inferColumnWidths `align` has incorrect value, valid options: left, right';
            }
        }

        // Last column
        if (i === last) {
            columns[i].pos.length = undefined;
        }
    }

    //
    // Pass 3: Create getValue() methods
    //
    for (i = 0; i < len; i++) {
        columns[i].getValue = (function(pos) {
            return function(str) {
                return String.prototype.substr.call(str, pos.start, pos.length).trim();
            };
        }(columns[i].pos));
    }

    return columns;
};
