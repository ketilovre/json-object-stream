'use strict';

var jos = require('../');
var helpers = require('./helpers');

describe('parsing', function() {

  it('should abort if the root level item is neither an array or an object', function(done) {
    var json = 'hello world';
    var stream = helpers.chunkedStream(json);

    stream.pipe(jos.parse()).on('error', function(err) {
      err.should.be.instanceof(Error);
      done();
    });
  });

  it('should return a stream in object mode', function() {
    var json = 'hello world';
    var stream = helpers.chunkedStream(json);

    stream.pipe(jos.parse())._readableState.objectMode.should.be.true();
  });
});
