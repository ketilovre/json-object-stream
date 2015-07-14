'use strict';

var Readable = require('stream').Readable;

function chunkSplit(str) {
  return str.match(new RegExp('.{1,' + parseInt(str.length / 8) + '}', 'g'));
}

exports.chunkedStream = function(jsonStr) {
  var stream = new Readable();
  chunkSplit(jsonStr).forEach(function(chunk) {
    stream.push(chunk);
  });
  stream.push(null);
  return stream;
};

exports.objectStream = function(arr) {
  var stream = new Readable({objectMode: true});
  arr.forEach(function(obj) {
    stream.push(obj);
  });
  stream.push(null);
  return stream;
};
