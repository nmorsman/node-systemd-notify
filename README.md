systemd-notify
==============

Notify `systemd` about start-up completion and other daemon status changes.


### Installation

`npm install systemd-notify`


### Usage

__notify(opts, [callback]);__

```js
var notify = require('systemd-notify');

notify({
    ready: true,
    status: 'Ready to go',
    pid: 1337,
    booted: true
}, function(err) {
    // Done
});
```

For more information about the options, consult the man-page:
[https://www.freedesktop.org/software/systemd/man/systemd-notify.html](https://www.freedesktop.org/software/systemd/man/systemd-notify.html)


### License

[MIT](LICENSE)
