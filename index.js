'use strict';

var through2 = require('through2');
var Parser = require('./src/parser.js');
var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');

exports.stringify = function() {
  var first = true;
  return through2.obj(function (chunk, enc, cb) {
    if (first) {
      this.push('[');
      first = false;
    } else {
      this.push(',');
    }
    this.push(JSON.stringify(chunk));
    cb();
  }, function (cb) {
    if (first) {
      this.push('[');
    }
    this.push(']');
    cb();
  });
};

exports.parse = function() {
  var parser = new Parser();
  return through2.obj(function (chunk, enc, cb) {
    var transformer = this;
    try {
      parser.read(decoder.write(chunk)).forEach(function (json) {
        transformer.push(json);
      });
      cb();
    } catch (err) {
      cb(err);
    }
  });
};

exports.toBufferStream = function() {
  return through2();
};
