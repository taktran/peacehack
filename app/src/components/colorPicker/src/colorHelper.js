"use strict";

/**
 * Color helper methods
 */
angular.module('app').factory('colorHelper', function(
  $q,
  $log,
  apiService
) {
  var colorHelper = {};

  // Color to use when color calls fail
  var fallbackColor = "rgb(0, 0, 0)";

  /**
   * Get light color using api
   *
   * @param  {String} lightId
   * @return {Promise} Promise of the light colour
   */
  colorHelper.getColor = function(lightId) {
    var deferred = $q.defer();

    apiService.currentState(lightId).then(function(resp) {
      var color = colorHelper.objectToRGB(resp.data.message);
      deferred.resolve(color);
    }).catch(function(error) {
      $log.log("Can't get light " + lightId, error);
      deferred.resolve(fallbackColor);
    });

    return deferred.promise;
  };

  /**
   * Convert color object to rgb string
   *
   * @param  {Object} color Object in the format:
   *   {
   *     r: 1,
   *     g: 2,
   *     b: 3
   *    }
   *
   * @return {String} rgbString eg, rgb(1, 2, 3)
   */
  colorHelper.objectToRGB = function(color) {
    return "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
  };

  /**
   * Parse colour into an object
   *
   * @param  {String} colorRGBString Color settings as a "rgb(r ,g, b)" value
   * @return {Object} Parsed color object in the form:
   *
   * {
   *   r: 1,
   *   g: 2,
   *   b: 3
   * }
   */
  colorHelper.rgbToObject = function(colorRGBString) {
    var color = {};
    var colorRegex = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;

    var matches = colorRGBString.match(colorRegex);

    if (matches) {
      color.r = parseInt(matches[1], 10);
      color.g = parseInt(matches[2], 10);
      color.b = parseInt(matches[3], 10);
    }

    return color;
  };

  return colorHelper;

});