"use strict";

var Hapi = require('hapi');
var moment = require('moment');
var _ = require('lodash');
var socketIO = require('./socketIO');
var path = require('path');

require('colors');

var host = '0.0.0.0';
var port = process.env.PORT || 7790;

var server = new Hapi.Server(host, port, {
  // docs: true
  cors: true
});

server.on('log', function(event, tags) {
  var rawData = event.data;
  var data = _.isObject(rawData) ? JSON.stringify(rawData) : rawData;
  var tagsStr = '[' + Object.keys(tags).join(', ') + ']';
  var timeStr = moment().format('HH:mm:ss,YYYY-MM-DD');
  var prefix = timeStr + " " + tagsStr;

  if (_.has(tags, 'error')) {
    prefix = prefix.red;
  } else if (_.has(tags, 'debug')) {
    prefix = prefix.yellow;
  } else if (_.has(tags, 'success')) {
    prefix = prefix.green;
  } else {
    prefix = prefix.grey;
  }

  console.log(
    prefix + " " + ('' + data).cyan
  );
});

// Initialise api routes
server.route(require('./routes/lightsApi')(server));

// Static file handler
server.route({
  method: 'GET',
  path: '/{file*}',
  config: {
    auth: false,
    handler: {
      directory: {
        path: __dirname + "/../../app/public"
      }
    }
  }
});

server.start(function() {
  var msg = "Server started at: " + server.info.uri;
  var prod = process.env.NODE_ENV === "production" ? " [production]" : "";

  // TODO: Still doesn't work
  // Works in hapi-socketio.js though
  socketIO.start(server, path.join(__dirname, "..", ".."));

  server.log(["debug"], msg + prod);
});

