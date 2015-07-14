Json Object Stream
=====

### Installation

`npm install json-object-stream`

### Example

```javascript
var jos = require('json-object-stream');
// A stream containing the following json as buffer chunks
//
// [
//  {"name": "dave"},
//  {"name": "alan"},
//  {"name": "kate"}
// ]
var stream = ...

// docStream is a stream in ObjectMode, and will emit, in order
//
// {"name": "dave"}
// {"name": "alan"}
// {"name": "kate"}
//
// as json objects.
var docStream = stream.pipe(jos.parse());
```

### Usage

The library contains three methods:

#### `parse`

```javascript
var jos = require('json-object-stream');

stream.pipe(jos.parse()).pipe(...)
```

Takes a stream containing either an array or a single object as string/buffer chunks and emits parsed json objects as they become available. The resulting stream will be in `ObjectMode`, with each element being a json object.

#### `stringify`

```javascript
var jos = require('json-object-stream');

stream.pipe(jos.stringify()).pipe(...)
```

Takes a stream in `ObjectMode` containing json documents, and stringifies them, inserting square brackets and commas before, after and in-between documents. Concatenating the resulting stream will result in a valid json array containing the objects from the stream. The resulting stream will still be in `ObjectMode`.

#### `toBufferStream`

```javascript
var jos = require('json-object-stream');

stream.pipe(jos.stringify()).pipe(jos.toBufferStream)
```

Simple helper for turning `ObjectMode` off.
