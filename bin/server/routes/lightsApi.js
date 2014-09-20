"use strict";

var Hapi = require('hapi');
var _ = require('lodash');
var request = require('request');

// Constants
var SPARK_API = "https://api.spark.io/v1/devices/";
var REQUEST_TIMEOUT = 5000;

var HTTP_OK = 200;

// Source of where to get secrets from
// In production, use environment variables. Otherwise
// use the secrets file.
var secretsSource = process.env.NODE_ENV === "production" ? process.env : require("../../../config/_SECRETS");
var SECRETS = {
  API_KEY: secretsSource.API_KEY,
  SPARK_ID: secretsSource.SPARK_ID
};

var lightIdDeviceKey = {
  "1": SECRETS.SPARK_ID
};

/**
 * Spark.io functions
 *
 * Mocks the sinequa server and serves out sample data
 */
module.exports = function(server) {

  function isValidLight(lightId) {
    return _.contains(_.keys(lightIdDeviceKey), lightId);
  }

  function getDeviceUrl(deviceId) {
    return SPARK_API + deviceId;
  }

  function errorMessage(url, error, response, body) {
    var statusCode = response ? response.statusCode : "[response undefined]";

    return url +
      "\nerror: " + error +
      "\nstatus: " + statusCode +
      "\nbody: " + body;
  }

  function successResponse(resp) {
    return {
      "statusCode": 200,
      "message": resp
    };
  }

  function getLightColor(req, reply) {
    var lightId = req.params.id;

    if (isValidLight(lightId)) {
      var deviceId = lightIdDeviceKey[lightId];
      var url = getDeviceUrl(deviceId) + "/state";

      request.get(url, {
        headers: {
          'Authorization': 'Bearer ' + SECRETS.API_KEY
        },
        timeout: REQUEST_TIMEOUT
      }, function(error, response, body) {
        if (error || response.statusCode !== HTTP_OK) {
          server.log(["error"], errorMessage(url, error, response, body));
          return reply(Hapi.error.internal());
        }

        try {
          var parsedBody = JSON.parse(body);
          var result = JSON.parse(parsedBody.result);
          var resultResp = successResponse(result);

          server.log(["debug", "getLightColor"], "Response (" +  response.statusCode + "): " + parsedBody.result);

          reply(resultResp);
        } catch(e) {
          server.log(["error", "json"], errorMessage(url, error, response, body));
          return reply(Hapi.error.internal());
        }
      });
    } else {
      return reply(Hapi.error.badRequest("Invalid light id: " + lightId));
    }
  }

  function changeLight(req, reply) {
    var lightId = req.params.id;

    if (isValidLight(lightId)) {
      var deviceId = lightIdDeviceKey[lightId];
      var url = getDeviceUrl(deviceId) + "/update";
      var color = {
        r: req.payload.r,
        g: req.payload.g,
        b: req.payload.b
      };

      var args = color.r + ";" + color.g + ";" + color.b;
      server.log(["debug"], "args = " + args);

      request.post(url, {
        headers: {
          'Authorization': 'Bearer ' + SECRETS.API_KEY
        },
        form: {
          args: args
        },
        timeout: REQUEST_TIMEOUT
      }, function(error, response, body) {
        if (error || response.statusCode !== HTTP_OK) {
          server.log(["error"], errorMessage(url, error, response, body));
          return reply(Hapi.error.internal());
        }

        server.log(["debug", "changeLight"], "Response (" +  response.statusCode + "): " + body);

        reply(successResponse(color));
      });
    } else {
      return reply(Hapi.error.badRequest("Invalid light id: " + lightId));
    }
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
    }
  ];
};