'use strict';

module.exports = function() {

  var ARRAY = 2;
  var OBJECT = 1;
  var UNKNOWN = 0;

  var buffer = '';
  var output = [];
  var depth = 0;
  var mode = UNKNOWN;

  function read(chunk) {
    output = [];
    for (var i = 0, l = chunk.length; i < l; i++) {
      if (mode === UNKNOWN) {
        determineMode(chunk[i]);
      } else {
        absorb(chunk[i]);
      }
    }
    return output;
  }

  function determineMode(firstChar) {
    if (firstChar === '[') {
      mode = ARRAY;
    } else if (firstChar === '{') {
      mode = OBJECT;
      depth++;
      buffer += firstChar;
    } else {
      throw new Error("Expected first character to be '{' or '['");
    }
  }

  function absorb(char) {
    switch (mode) {
      case ARRAY:
        parseArray(char);
        break;
      case OBJECT:
        parseObject(char);
        break;
    }
  }

  function parseArray(char) {
    switch (char) {
      case '{':
        buffer += char;
        depth++;
        break;
      case '}':
        buffer += char;
        depth--;
        if (depth === 0) {
          createObject();
        }
        break;
      case ',':
        if (depth > 0) {
          buffer += char;
        }
        break;
      case ']':
        if (depth > 0) {
          buffer += char;
        }
        break;
      default:
        buffer += char;
    }
  }

  function parseObject(char) {
    switch (char) {
      case '{':
        buffer += char;
        depth++;
        break;
      case '}':
        buffer += char;
        depth--;
        if (depth === 0) {
          createObject();
        }
        break;
      default:
        buffer += char;
    }
  }

  function createObject() {
    output = output.concat([JSON.parse(buffer)]);
    buffer = '';
    depth = 0;
  }

  return {
    read: read
  };
};
