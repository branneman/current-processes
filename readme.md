# current-processes
Get a snapshot of the currently running processes, OS-agnostic

## Usage
```js
var ps = require('current-processes');

ps.get(function(err, processes) {
    console.log(processes);
});
```

## Example output
```js
[
    { pid: 1, name: 'init', mem: 33753, cpu: 0},
    { pid: 2765, name: 'httpd', mem: 23097, cpu: 0},
    { pid: 3324, name: 'chrome', mem: 23054, cpu: 0.1},
    { pid: 4432, name: 'chrome', mem: 78923, cpu: 34.8}
]
```
