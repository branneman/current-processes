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

## Example output
```js
[
    { pid: 1, name: 'init', mem: 33753},
    { pid: 2765, name: 'httpd', mem: 23097},
    { pid: 3324, name: 'chrome', mem: 23054},
    { pid: 4432, name: 'chrome', mem: 78923}
]
```
