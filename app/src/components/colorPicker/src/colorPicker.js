"use strict";

angular.module('app').config(function(
  $stateProvider,
  $urlRouterProvider
) {
  // Color to use when color calls fail
  var fallbackColor = "rgb(0, 0, 0)";

  function getLightColor(lightId, $q, apiService, colorHelper) {
    var deferred = $q.defer();

    apiService.currentState(lightId).then(function(resp) {
      var color = colorHelper.objectToRGB(resp.data.message);
      deferred.resolve(color);
    }).catch(function(error) {
      console.log("Can't get light 2", error);
      deferred.resolve(fallbackColor);
    });

    return deferred.promise;
  }

  // Redirect to root if unknown url
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('colorPicker', {
      templateUrl: 'components/colorPicker/templates/colorPicker.html',
      url: '/',
      controller: 'ColorPickerCtrl',
      resolve: {
        light1Color: function(
          $q,
          apiService,
          colorHelper
        ) {
          return getLightColor("1", $q, apiService, colorHelper);
        },
        light2Color: function(
          $q,
          apiService,
          colorHelper
        ) {
          return getLightColor("2", $q, apiService, colorHelper);
        }
      }
    }
  );
});