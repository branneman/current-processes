module.exports.correct = [
    {
        columns: [
            {
                query: 'PID',
                align: 'left'
            },
            {
                query: 'VSZ',
                align: 'left'
            },
            {
                query: '%CPU',
                align: 'left'
            },
            {
                query: 'COMM',
                align: 'left'
            }
        ],
        string: ' PID    VSZ    %CPU   COMM',
        expect: [
            { start: 0,  length: 7 },
            { start: 8,  length: 7 },
            { start: 15, length: 7 },
            { start: 22, length: undefined }
        ]
    },
    {
        columns: [
            {
                query: 'PID',
                align: 'right'
            },
            {
                query: 'VSZ',
                align: 'right'
            },
            {
                query: '%CPU',
                align: 'right'
            },
            {
                query: 'COMMAND',
                align: 'left'
            }
        ],
        string: ' PID    VSZ  %CPU COMMAND',
        expect: [
            { start: 0,  length: 4 },
            { start: 4,  length: 7 },
            { start: 11, length: 6 },
            { start: 18, length: undefined }
        ]
    },
    {
        columns: [
            {
                query: 'PID',
                align: 'right'
            },
            {
                query: 'VSZ',
                align: 'right'
            },
            {
                query: 'COMMAND',
                align: 'left'
            }
        ],
        string: '  PID    VSZ COMMAND',
        expect: [
            { start: 0,  length: 5 },
            { start: 5,  length: 7 },
            { start: 13, length: undefined }
        ]
    },
    {
        columns: [
            {
                query: 'IDProcess',
                align: 'left'
            },
            {
                query: 'Name',
                align: 'left'
            },
            {
                query: 'PercentProcessorTime',
                align: 'left'
            },
            {
                query: 'WorkingSetPrivate',
                align: 'left'
            }
        ],
        string: 'IDProcess  Name                             PercentProcessorTime  WorkingSetPrivate',
        expect: [
            { start: 0,  length: 11 },
            { start: 11, length: 33 },
            { start: 44, length: 22 },
            { start: 66, length: undefined }
        ]
    },
    {
        columns: [
            {
                query: 'PID',
                align: 'right'
            },
            {
                query: 'VSZ',
                align: 'right'
            },
            {
                query: '%CPU',
                align: 'right'
            },
            {
                query: 'COMMAND',
                align: 'left'
            }
        ],
        string: '  PID   VSZ  %CPU COMMAND',
        expect: [
            { start: 0,  length: 5 },
            { start: 5,  length: 6 },
            { start: 11, length: 6 },
            { start: 18, length: undefined }
        ]
    },
    {
        columns: [
            {
                query: 'PID',
                align: 'right'
            },
            {
                query: 'VSZ',
                align: 'right'
            },
            {
                query: '%CPU',
                align: 'right'
            },
            {
                query: 'COMM',
                align: 'left'
            }
        ],
        string: ' PID      VSZ  %CPU COMM',
        expect: [
            { start: 0,  length: 4 },
            { start: 4,  length: 9 },
            { start: 13, length: 6 },
            { start: 20, length: undefined }
        ]
    },
    {
        columns: [
            {
                query: 'PID',
                align: 'right'
            },
            {
                query: 'RSS',
                align: 'right'
            },
            {
                query: 'VSZ',
                align: 'right'
            },
            {
                query: '%CPU',
                align: 'right'
            },
            {
                query: 'COMMAND',
                align: 'left'
            }
        ],
        string: ' PID      RSS   VSZ  %CPU COMMAND',
        expect: [
            { start: 0,  length: 4 },
            { start: 4,  length: 9 },
            { start: 13, length: 6 },
            { start: 19, length: 6 },
            { start: 26, length: undefined }
        ]
    }
];

module.exports.incorrect = [
    {
        columns: [
            {
                query: 'PID',
                align: 'middle'
            },
            {
                query: 'COMMAND',
                align: 'left'
            }
        ],
        string: '  PID COMMAND'
    },
    {
        columns: [
            {
                query: 'PID',
                align: 'right'
            },
            {
                query: 'PID',
                align: 'middle'
            },
            {
                query: 'COMMAND',
                align: 'left'
            }
        ],
        string: '  PID   VSZ   COMMAND'
    }
];