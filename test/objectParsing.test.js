'use strict';

require('should');
var helpers = require('./helpers');
var jos = require('../index');
var Readable = require('stream').Readable;

describe('objectParsing', function() {

  it('should parse streams containing single objects', function(done) {
    var json = {foo: true, bar: false};
    var stream = helpers.chunkedStream(JSON.stringify(json));

    stream.pipe(jos.parse()).on('data', function (object) {
      object.should.be.eql(json);
      done();
    });
  });

  it('should only emit the object when there is a balance of brackets', function(done) {
    var json = {obj: {obj2: {foo: true}}};
    var stream = helpers.chunkedStream(JSON.stringify(json));

    stream.pipe(jos.parse()).on('data', function (object) {
      object.should.be.eql(json);
      done();
    });
  });

  it('should rethrow any parsing error onto the stream', function(done) {
    var json = ['[', '{"foo": true},', '{"foo: false}', ']'];

    var stream = new Readable();
    json.forEach(function(chunk) {
      stream.push(chunk);
    });
    stream.push(null);

    stream.pipe(jos.parse())
      .on('data', function(object) {
        object.should.be.eql({foo: true});
      })
      .on('error', function(error) {
        error.should.be.instanceof(SyntaxError);
        done();
      });
  });
});
