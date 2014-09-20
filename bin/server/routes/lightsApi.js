"use strict";

var Hapi = require('hapi');
var spark = require('../spark');

/**
 * Spark.io functions
 */
module.exports = function(server) {

  function getLightColor(req, reply) {
    var lightId = req.params.id;

    spark.getLightColor(lightId).then(function(data) {
      reply(data);
    }, function(error) {
      server.log(["error", "getLightColor"], error);
      reply(Hapi.error.internal());
    });
  }

  function changeLight(req, reply) {
    var lightId = req.params.id;
    var color = req.payload;

    spark.changeLight(lightId, color).then(function(data) {
      reply(data);
    }, function(error) {
      server.log(["error", "changeLight"], error);
      reply(Hapi.error.internal());
    });
  }

  function randomLight(req, reply) {
    var lightId = req.params.id;

    spark.randomLight(lightId).then(function(data) {
      reply(data);
    }, function(error) {
      server.log(["error", "changeLight"], error);
      reply(Hapi.error.internal());
    });
  }

  return [
    {
      method: 'GET',
      path: '/lights/{id}',
      config: {
        handler: getLightColor
      }
    },
    {
      method: 'POST',
      path: '/lights/{id}',
      config: {
        handler: changeLight
      }
    },
    {
      method: 'POST',
      path: '/lights/{id}/random',
      config: {
        handler: randomLight
      }
    }
  ];
};