/**
 * Talk to spark core
 */

var request = require('request');
var q = require('q');
var _ = require('lodash');
var helpers = require('../helpers/helpers');

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
  SPARK_1_ID: secretsSource.SPARK_1_ID,
  SPARK_2_ID: secretsSource.SPARK_2_ID
};

var lightIdDeviceKey = {
  "1": SECRETS.SPARK_1_ID,
  "2": SECRETS.SPARK_2_ID
};


function isValidLight(lightId) {
  return _.contains(_.keys(lightIdDeviceKey), lightId);
}

function getDeviceUrl(deviceId) {
  return SPARK_API + deviceId;
}

module.exports = {
  /**
   * Get light color
   *
   * @param  {String} lightId
   * @return {Promise} Promise of color
   */
  getLightColor: function(lightId) {
    var deferred = q.defer();

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
          deferred.reject(helpers.errorMessage(url, error, response, body));
        } else {
          try {
            var parsedBody = JSON.parse(body);
            var result = JSON.parse(parsedBody.result);
            var resultResp = helpers.successResponse(result);

            // server.log(["debug", "getLightColor"], "Response (" +  response.statusCode + "): " + parsedBody.result);

            deferred.resolve(resultResp);
          } catch(e) {
            deferred.reject(helpers.errorMessage(url, e, response, body));
          }
        }
      });
    } else {
      deferred.reject("Invalid light id: " + lightId);
    }

    return deferred.promise;
  },

  /**
   * Change to a random color
   *
   * @param  {String} lightId
   * @return {Promise} Promise of color change results
   */
  randomLight: function(lightId) {
    var deferred = q.defer();

    if (isValidLight(lightId)) {
      var deviceId = lightIdDeviceKey[lightId];
      var url = getDeviceUrl(deviceId) + "/random";

      request.post(url, {
        headers: {
          'Authorization': 'Bearer ' + SECRETS.API_KEY
        },
        timeout: REQUEST_TIMEOUT
      }, function(error, response, body) {
        if (error || response.statusCode !== HTTP_OK) {
          deferred.reject(helpers.errorMessage(url, error, response, body));
        } else {
          // server.log(["debug", "changeLight"], "Response (" +  response.statusCode + "): " + body);

          deferred.resolve(helpers.successResponse());
        }
      });
    } else {
      deferred.reject("Invalid light id: " + lightId);
    }

    return deferred.promise;
  },

  /**
   * Change color
   *
   * @param  {String} lightId
   * @param  {Object} color Color object: { r: Integer, g: Integer, b: Integer }
   * @return {Promise} Promise of color change results
   */
  changeLight: function(lightId, color) {
    var deferred = q.defer();

    if (isValidLight(lightId)) {
      var deviceId = lightIdDeviceKey[lightId];
      var url = getDeviceUrl(deviceId) + "/update";

      var args = color.r + ";" + color.g + ";" + color.b;
      // server.log(["debug"], "args = " + args);

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

          deferred.reject(helpers.errorMessage(url, error, response, body));
        } else {
          // server.log(["debug", "changeLight"], "Response (" +  response.statusCode + "): " + body);

          deferred.resolve(helpers.successResponse(color));
        }
      });
    } else {
      deferred.reject("Invalid light id: " + lightId);
    }

    return deferred.promise;
  }
};