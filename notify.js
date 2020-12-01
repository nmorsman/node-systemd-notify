/**
 * systemd-notify
 */

const { spawn } = require('child_process');


function generateArgs(opts) {
    const result = [];

    if (('ready' in opts) && (opts.ready === true)) {
        result.push('--ready');
    }

    if ('pid' in opts) {
        result.push(`--pid=${opts.pid}`);
    }
    else if (('ready' in opts) || ('status' in opts)) {
        /**
         * Always send PID to avoid possible race condition
         * https://www.pluralsight.com/tech-blog/using-systemd-notify-with-nodejs/
         */

        result.push(`--pid=${process.pid}`);
    }

    if ('status' in opts) {
        result.push(`--status=${opts.status}`);
    }

    if (('booted' in opts) && (opts.booted === true)) {
        result.push('--booted');
    }

    if ('variables' in opts) {
        Object.keys(opts.variables).forEach((key) => {
            result.push(`${key}=${opts.variables[key]}`);
        });
    }

    return result;
}


module.exports = (opts = {}, callback) => new Promise((resolve, reject) => {
    const args = generateArgs(opts);
    const cmd = spawn('systemd-notify', args);

    let stdout = '';
    let stderr = '';
    let hasCalledBack = false;

    cmd.stdout.on('data', (d) => { stdout += d; });
    cmd.stderr.on('data', (d) => { stderr += d; });

    cmd.on('error', (err) => {
        if (hasCalledBack) {
            return null;
        }

        hasCalledBack = true;
        return (typeof callback === 'function') ? callback(err) : reject(err);
    });

    cmd.on('close', (code) => {
        if (hasCalledBack) {
            return null;
        }

        hasCalledBack = true;

        if (code !== 0) {
            const err = stderr.trim() || stdout.trim();
            return (typeof callback === 'function') ? callback(err) : reject(err);
        }

        return (typeof callback === 'function') ? callback(null, cmd) : resolve(cmd);
    });
});
