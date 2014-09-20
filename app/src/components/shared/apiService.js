"use strict";

angular.module('app').factory('apiService', function (
  $http,
  CONFIG,
  envService
) {
  var LIGHTS_URL = envService.apiBase() + "lights/";

  function getUrl(lightId) {
    return LIGHTS_URL + lightId;
  }

  function getRandomUrl(lightId) {
    return LIGHTS_URL + lightId + "/random";
  }

  return {
    updateLight: function(lightId, red, green, blue) {
      var url = getUrl(lightId);

      return $http.post(url, {
        r: red,
        g: green,
        b: blue
      });
    },
    randomLight: function(lightId) {
      var url = getRandomUrl(lightId);

      return $http.post(url);
    },
    currentState: function(lightId) {
      var url = getUrl(lightId);

      return $http.get(url, {
        timeout: CONFIG.getStateTimeout
      });
    }
  };
});
