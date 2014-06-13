# current-processes
Get a snapshot of the currently running processes, OS-agnostic

## Example
```js
const ps = require('current-processes');

ps.get().forEach(function(proc) {
    console.log(proc.pid, proc.name, proc.mem);
});
```