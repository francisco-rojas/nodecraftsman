'use strict';

var fs = require('fs');

// we create a read stream that will start to retrieve the contents of file /path/to/large/-
// file. The call to fs.createReadStream does not take a function argument to use it as a callback
// The object that is returned by fs.createReadStream is an Event Emitter
var stream = fs.createReadStream('/path/to/large/file');
var content = '';

// we attach a callback to one type of events the ReadStream emits: data events
// the data event will be emitted multiple times, depending on the size of the file. The
// callback that is attached to this event will therefore be called multiple times.
stream.on('data', function (data) {
    console.log('Received data: ' + data);
    content = content + data;
});

// we attach another callback to another type of event the ReadStream emits: the end event
// When all content has been retrieved, the end event is fired once, and no other events will be fired
// from then on. The end event callback is therefore the right place to do whatever we want to do after
// we retrieved the complete file content
stream.on('end', function () {
    console.log('File content has been retrieved: ' + content);
});

// It doesn’t make too much sense to efficiently read a large file’s content in chunks, only
// to assign the whole data to a variable and therefore using the memory anyways. In a real
// application, we would read a file in chunks to, for example, send every chunk to a web
// client that is downloading the file via HTTP.

// Most event emitters emit an event called “error” whenever an error occurs, and if we don’t listen to
// this event, the event emitter will raise an exception.
stream.on('error', function(err) {
    console.log('Sad panda: ' + err);
});

// Instead of using on, we can also attach a callback to an event using once. Callbacks that are attached
// this way will be called the first time that the event occurs, but will then be removed from the list of
// event listeners and not be called again:
stream.once('data', function(data) {
    console.log('I have received the first chunk of data');
});

// it’s possible to detach an attached callback manually. This only works with named callback
// functions:

var callback = function(data) {
    console.log('I have received a chunk of data: ' + data);
}

stream.on('data', callback);
stream.removeListener('data', callback);

// you can remove all attached listeners for a certain event:
stream.removeAllListeners('data');
