'use strict';

var fs = require('fs');

var FilesizeWatcher = function (path) {
    // we assign the object instance variable to a local self variable - this way we can access our
    // instantiated object within callback functions, where this would point to another object.
    var self = this;

    self.callbacks = {};

    if (/^\//.test(path) === false) {
        // Moving code execution into the next event loop iteration is simple thanks to the process.nextTick
        // method
        // With this, we put the callback triggering for the error event listener into a callback function that
        // will be executed by process.nextTick on the next iteration of the event loop:
        process.nextTick(function(){
            self.callbacks['error']('Path does not start with a slash');
        });
        return;
    }

    fs.stat(path, function (err, stats) {
        self.lastfilesize = stats.size;
    });

    self.interval = setInterval(
        function () {
            fs.stat(path, function (err, stats) {
                if (stats.size > self.lastfilesize) {
                    self.callbacks['grew'](stats.size - self.lastfilesize);
                    self.lastfilesize = stats.size;
                }
                if (stats.size < self.lastfilesize) {
                    self.callbacks['shrank'](self.lastfilesize - stats.size);
                    self.lastfilesize = stats.size;
                }
            }, 1000);
        });
};

FilesizeWatcher.prototype.on = function (eventType, callback) {
    this.callbacks[eventType] = callback;
};

FilesizeWatcher.prototype.stop = function () {
    clearInterval(this.interval);
};

module.exports = FilesizeWatcher;
