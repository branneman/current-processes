'use strict';

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
 * @returns The given columns object, enhanced with substr(str) method
 */
module.exports.inferColumnWidths = function inferColumnWidths(columns, string) {

    var i;
    var len  = columns.length;
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
                var nextColumn = columns[i + 1].pos;
                columns[i].pos.length = (nextColumn.start - columns[i].pos.start);
            }

            else if (columns[i].align === 'right') {
                columns[i].pos.length += columns[i].pos.start;
            }

            columns[i].pos.start = 0;
        }

        // Middle column
        else if (i < last) {

            if (columns[i].align === 'left') {
                var nextColumn = columns[i + 1].pos;
                columns[i].pos.length = (nextColumn.start - columns[i].pos.start);
            }

            else if (columns[i].align === 'right') {
                var previousColumn = columns[i - 1].pos;
                columns[i].pos.start  = (previousColumn.start + previousColumn.length);
                columns[i].pos.length = (columns[i].pos.start + columns[i].pos.length - 1);
            }
        }

        // Last column
        if (i === last) {
            columns[i].pos.length = undefined;
        }
    }

    //
    // Pass 3: Create substr() methods
    //
    for (i = 0; i < len; i++) {
        columns[i].substr = (function(pos) {
            return function(str) {
                return String.prototype.substr.call(str, pos.start, pos.length).trim();
            };
        }(columns[i].pos));
    }

    return columns;
};
