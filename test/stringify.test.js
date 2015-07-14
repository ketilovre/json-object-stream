'use strict';

var jos = require('../');
var helpers = require('./helpers');
var Readable = require('readable-stream').Readable;

describe('stringify', function() {

  it('should stringify a stream of objects, inserting square brackets and commas along the way', function(done) {
    var concatenatedResult = '';
    var json = [{foo: true}, {foo: false}, {foo: null}];
    var stream = helpers.objectStream(json);

    stream.pipe(jos.stringify()).on('data', function(data) {
      concatenatedResult += data;
    }).on('end', function() {
      JSON.parse(concatenatedResult).should.be.eql(json);
      done();
    });
  });

  it('should stream an empty array if the stream contains zero objects', function(done) {
    var concatenatedResult = '';
    var stream = new Readable();
    stream.push(null);

    stream.pipe(jos.stringify()).on('data', function(data) {
      concatenatedResult += data;
    }).on('end', function() {
      JSON.parse(concatenatedResult).should.be.eql([]);
      done();
    });
  });
});

describe('toBufferStream', function() {

  it('should transform a stream in object mode to a stream in buffer mode', function() {
    var json = [{foo: true}];
    var stream = helpers.objectStream(json);

    stream._readableState.objectMode.should.be.true();
    stream.pipe(jos.stringify()).pipe(jos.toBufferStream())._readableState.objectMode.should.be.false();
  });
});
