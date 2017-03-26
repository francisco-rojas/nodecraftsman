'use strict';

var FilesizeWatcher = require('../src/file_size_watcher');
var exec = require('child_process').exec;

// ./node_modules/jasmine-node/bin/jasmine-node spec/file_size_watcher_spec.js

describe('FilesizeWatcher', function () {

    var watcher;

    afterEach(function () {
        watcher.stop();
    });

    it('should fire a "grew" event when the file grew in size', function (done) {

        var path = '/var/tmp/filesizewatcher.test';
        exec('rm -f ' + path + ' ; touch ' + path, function () {
            watcher = new FilesizeWatcher(path);

            watcher.on('grew', function (gain) {
                expect(gain).toBe(5);
                // The done function is a callback that is passed to the function parameter of an it block by Jasmine.
                // This pattern is used when testing asynchronous operations. Our emitter emits events asynchronously,
                // and Jasmine cannot know by itself when events will fire. It needs our help by being
                // told “now the asynchronous operation I expected to occur did actually occur” - and this is done by
                // triggering the callback.
                done();
            });

            exec('echo "test" > ' + path, function () {
            });

        });

    });

    it('should fire a "shrank" event when the file grew in size', function (done) {

        var path = '/var/tmp/filesizewatcher.test';
        exec('rm -f ' + path + ' ; echo "test" > ' + path, function () {
            watcher = new FilesizeWatcher(path);

            watcher.on('shrank', function (loss) {
                expect(loss).toBe(3);
                done();
            });

            exec('echo "a" > ' + path, function () {
            });

        });

    });

    it('should fire "error" if path does not start with a slash', function (done) {

        var path = 'var/tmp/filesizewatcher.test';
        watcher = new FilesizeWatcher(path);

        watcher.on('error', function (err) {
            expect(err).toBe('Path does not start with a slash');
            done();
        });

    });

});
