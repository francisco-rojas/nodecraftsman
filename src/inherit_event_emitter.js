'use strict';

var fs = require('fs');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var FilesizeWatcher = function (path) {
    var self = this;

    if (/^\//.test(path) === false) {
        process.nextTick(function () {
            self.emit('error', 'Path does not start with a slash');
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
                    self.emit('grew', stats.size - self.lastfilesize);
                    self.lastfilesize = stats.size;
                }
                if (stats.size < self.lastfilesize) {
                    self.emit('shrank', self.lastfilesize - stats.size);
                    self.lastfilesize = stats.size;
                }
            }, 1000);
        });
};

// We use a helper function that ships with Node.js, util.inherits.
// We use it to make our FilesizeWatcher class a descendant of events.EventEmitter, which also ships
// with Node.js. This class implements all the logic that is needed to act as an event emitter, and our
// FilesizeWatcher class inherits this logic. This way, our own code now concentrates on implementing
// its specific logic, without having to care about the details of registering callbacks and checking if
// these can be called etc.
// Instead of using util.inherits, we can also create the inheritance by placing a new
// events.EventEmitter object on the prototype of FilesizeWatcher. Although util.inherits adds some extra properties to our constructor
//      FilesizeWatcher.prototype = new EventEmitter();
util.inherits(FilesizeWatcher, EventEmitter);

FilesizeWatcher.prototype.stop = function () {
    clearInterval(this.interval);
};

module.exports = FilesizeWatcher;
