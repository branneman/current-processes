# current-processes
Node.js library to get a snapshot of the currently running processes, OS-agnostic. Needs root/Admin permissions.

**100% Code Coverage.** Run `npm test` to see for yourself.

## Process object
The library will return an array consisting of multiple process objects, structured like this:
```js
{
    pid: 1337,               // Process ID
    name: 'chrome',          // Process name
    mem: {
        private: 23054560,   // Private memory, in bytes
        virtual: 78923608,   // Virtual memory (private + shared libraries + swap space), in bytes
        usage: 0.02    	     // Used physical memory (%) by this process
    },
    cpu: 0.3                 // CPU usage (%) as reported by `ps` and `wmic`
}
```

## Platform-specific notes
### Windows
WMI (specifically `wmic`) is used to gather the information itself. WMI is fairly slow the first time it's called, it
might even take up to 2-3 seconds. Make sure your app will gracefully handle this. Subsequent calls will be much faster.

## Usage example
```js
var _ = require('lodash');
var ps = require('current-processes');

ps.get(function(err, processes) {

    var sorted = _.sortBy(processes, 'cpu');
    var top20  = sorted.reverse().splice(0, 20);

    console.log(top20);
});
```
