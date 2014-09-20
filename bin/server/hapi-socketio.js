// Adapted from hapi example: https://github.com/hapijs/hapi/blob/master/examples/socketio.js

// The following initializes a socket.io server.
// The socket.io client JavaScript is located at http://localhost:8000/socket.io/socket.io.js
// To create a new socket.io handshake make a POST request to http://localhost:8000/socket.io/1
// use the resulting session ID for subsequent requests (see https://github.com/LearnBoost/socket.io-spec)
// For example, in the chrome debug console you can create a new WebSocket with the following URI
// 'ws://localhost:8080/socket.io/1/websocket/Ww4ULq6wOTUZYD62v3yu'
// where Ww4ULq6wOTUZYD62v3yu is the session ID

// Load modules

var Hapi = require('hapi');
var socketIO = require('./socketIO');

// Declare internals

var internals = {};


internals.startServer = function () {

  var server = new Hapi.Server(8000);

  var helloHandler = function (request, reply) {
    reply('Hello');
  };

  server.route({
    method: 'GET',
    path: '/',
    handler: helloHandler
  });

  server.start(function () {
    socketIO.start(server);
  });
};


internals.startServer();