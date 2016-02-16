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
    if (mode === UNKNOWN) {
      if (chunk[0] === '[') {
        mode = ARRAY;
      } else if (chunk[0] === '{') {
        mode = OBJECT;
        depth++;
        buffer += chunk[0];
        chunk = chunk.slice(1);
      } else {
        console.warn("Expected first character to be '{' or '['");
        chunk = [];
      }

    }
    for (var i = 0, l = chunk.length; i < l; i++) {
      var char = chunk[i];
      if (mode === ARRAY) {
        if (char === '{') {
          buffer += char;
          depth++;
        } else if (char === '}') {
          buffer += char;
          depth--;
          if (depth === 0) {
            createObject();
          }
        } else if (char === ',') {
          if (depth > 0) {
            buffer += char;
          }
        } else if (char === ']') {
          if (depth > 0) {
            buffer += char;
          }
        } else {
          buffer += char;
        }
      } else if (char === '{') {
        buffer += char;
        depth++;
      } else if (char === '}') {
        buffer += char;
        depth--;
        if (depth === 0) {
          createObject();
        }
      } else {
        buffer += char;
      }
    }
    return output;
  }

  function createObject() {
    try{
      output.push(JSON.parse(buffer));
    }catch(e){
      console.warn('Error input string:',e);
    }
    buffer = '';
    depth = 0;
  }

  return {
    read: read
  };
};
