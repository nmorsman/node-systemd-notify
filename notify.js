var spawn = require('child_process').spawn;

function generateArguments(opts) {
    var result = [];

    if ((typeof opts.ready !== 'undefined') && (opts.ready === true)) {
        result.push('--ready');
    }

    if (typeof opts.pid !== 'undefined') {
        result.push('--pid=' + opts.pid);
    }

    if (typeof opts.status !== 'undefined') {
        result.push('--status=' + opts.status);
    }

    if ((typeof opts.booted !== 'undefined') && (opts.booted === true)) {
        result.push('--booted');
    }

    return result;
}

module.exports = function(opts, callback) {
    if (typeof opts === 'undefined') {
        opts = {};
    }

    var args = generateArguments(opts);
    var cmdStream = spawn('systemd-notify', args);
    var stdout = '';
    var stderr = '';

    cmdStream.stdout.on('data', function(d) {
        stdout += d;
    });

    cmdStream.stderr.on('data', function(d) {
        stderr += d;
    });

    cmdStream.on('error', function(err) {
        if (typeof callback === 'function') {
            callback(err);
        }
    });

    cmdStream.on('close', function(code) {
        if (code !== 0) {
            if (typeof callback === 'function') {
                callback(stderr.trim() || stdout.trim());
            }

            return;
        }

        if (typeof callback === 'function') {
            callback(null);
        }
    });
};
