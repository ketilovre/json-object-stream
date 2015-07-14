'use strict';

require('should');
var helpers = require('./helpers');
var jos = require('../index');

describe('arrayParsing', function() {

  it('should parse streams containing an array of objects', function(done) {
    var index = 0;
    var json = [{foo: true}, {foo: false}, {bar: true}, {bar: false}];
    var stream = helpers.chunkedStream(JSON.stringify(json));

    stream.pipe(jos.parse()).on('data', function (object) {
      object.should.be.eql(json[index]);
      index++;
      if (index > 3) {
        done();
      }
    });
  });

  it('should only emit objects when there is a balance of brackets', function(done) {
    var json = [{obj: {obj: {foo: true}}}];
    var stream = helpers.chunkedStream(JSON.stringify(json));

    stream.pipe(jos.parse()).on('data', function (object) {
      object.should.be.eql(json[0]);
      done();
    });
  });

  it('should only drop commas between root-level objects', function(done) {
    var index = 0;
    var json = [{foo: true, bar: false}, {foo: false, bar: true}];
    var stream = helpers.chunkedStream(JSON.stringify(json));

    stream.pipe(jos.parse()).on('data', function (object) {
      object.should.be.eql(json[index]);
      index++;
      if (index > 1) {
        done();
      }
    });
  });

  it('should drop the final closing square bracket, leaving others intact', function(done) {
    var json = [{arr: [1, 2, 3, 4]}];
    var stream = helpers.chunkedStream(JSON.stringify(json));

    stream.pipe(jos.parse()).on('data', function (object) {
      object.should.be.eql(json[0]);
      done();
    });
  });
});
