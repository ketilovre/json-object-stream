'use strict';

var Parser = require('./src/parser.js');
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');
var Stream = require('stream');
var util = require('util');

util.inherits(ParserStream, Stream.Transform);
function ParserStream(options) {
  this._parser = new Parser();
  Stream.Transform.call(this, options);
}

ParserStream.prototype._transform = function(chunk, encoding, done) {
  try {
    var json = this._parser.read(decoder.write(chunk));
    for (var i = 0, l = json.length; i < l; i++) {
      this.push(json[i]);
    }
    done();
  } catch (err) {
    done(err);
  }
};

util.inherits(StringifyStream, Stream.Transform);
function StringifyStream(options) {
  this._seenFirst = false;
  Stream.Transform.call(this, options);
}

StringifyStream.prototype._transform = function(chunk, encoding, done) {
  if (!this._seenFirst) {
    this.push('[');
    this._seenFirst = true;
  } else {
    this.push(',');
  }
  this.push(JSON.stringify(chunk));
  done();
};

StringifyStream.prototype._flush = function(done) {
  if (!this._seenFirst) {
    this.push('[');
  }
  this.push(']');
  done();
};

exports.parse = function() {
  return new ParserStream({objectMode: true});
};

exports.stringify = function() {
  return new StringifyStream({objectMode: true});
};

exports.toBufferStream = function() {
  return new Stream.PassThrough();
};
