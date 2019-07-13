systemd-notify
==============

*Notify `systemd` about start-up completion and other daemon status changes.*


## Installation

`npm install systemd-notify`


## Usage

`systemd-notify` supports both callbacks and promises.

__notify(opts = {}, [callback]);__

```js
const notify = require('systemd-notify');

const opts = {
    ready: true,
    status: 'Ready to go',
    pid: 1337
};


/**
 * Callback
 */

notify(opts, (err) => {
    /* Done */
});


/**
 * Promise
 */

notify(opts).then(() => {
    /* Done */
}).catch((err) => {
    /* Err */
});


/**
 * Async-await
 */

async function() {
    try {
        await notify(opts);
    }
    catch (e) {
        /* Err */
    }
}
```

For more information about the options, consult with the man-page:
[https://www.freedesktop.org/software/systemd/man/systemd-notify.html](https://www.freedesktop.org/software/systemd/man/systemd-notify.html)


## License

[MIT](LICENSE)
