# current-processes
Get a snapshot of the currently running processes, OS-agnostic

## Usage
```js
const ps = require('./current-processes');

ps.get(function(err, processes) {
    processes.forEach(function(proc) {
        console.log(proc.pid, proc.name, proc.mem);
    })
});
```