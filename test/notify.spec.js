/**
 * systemd-notify tests
 */

const { assert } = require('chai');
const notify = require('./../');


describe('systemd-notify', () => {
    /**
     * Manually set $NOTIFY_SOCKET during tests
     */

    before(() => {
        process.env.NOTIFY_SOCKET = '/var/run/systemd/notify';
    });


    /**
     * Callback
     */

    it('should succeed with callback', (done) => {
        notify({ booted: true }, (err) => {
            assert.isNull(err);
            done();
        });
    });

    it('should err with callback', (done) => {
        notify({}, (err) => {
            assert.isNotNull(err);
            done();
        });
    });


    /**
     * Promise
     */

    it('should succeed with promise', async () => {
        await notify({ booted: true });
    });

    it('should throw with promise', async () => {
        await assert.isRejected(notify());
    });


    /**
     * Args
     */

    it('should set --booted', async () => {
        const cmd = await notify({ booted: true });
        assert.isArray(cmd.spawnargs);
        assert.include(cmd.spawnargs, 'systemd-notify');
        assert.include(cmd.spawnargs, '--booted');
    });

    it('should set --ready and process pid', async () => {
        const cmd = await notify({ ready: true });
        assert.isArray(cmd.spawnargs);
        assert.include(cmd.spawnargs, '--ready');
        assert.include(cmd.spawnargs, `--pid=${process.pid}`);
    });

    it('should set --pid', async () => {
        const cmd = await notify({ ready: true, pid: 1234 });
        assert.isArray(cmd.spawnargs);
        assert.include(cmd.spawnargs, '--ready');
        assert.include(cmd.spawnargs, '--pid=1234');
    });

    it('should set --status', async () => {
        const cmd = await notify({ status: 'I am ready' });
        assert.isArray(cmd.spawnargs);
        assert.include(cmd.spawnargs, '--status="I am ready"');
        assert.include(cmd.spawnargs, `--pid=${process.pid}`);
    });


    /**
     * Missing $NOTIFY_SOCKET
     */

    it('should throw when missing $NOTIFY_SOCKET', async () => {
        process.env.NOTIFY_SOCKET = '';
        await assert.isRejected(notify({ ready: true }));
    });
});
