"use strict";

angular.module('app').controller('ColorPickerCtrl', function(
  $scope,
  $timeout,
  apiService,
  colorHelper,

  light1Color
) {
  $scope.settings = {
    light1: light1Color
  };

  $scope.randomColor = function() {
    apiService.randomLight(1);
    colorHelper.getColor("1").then(function(color) {
      $scope.settings.light1 = color;
    });
  };

  $timeout(function() {
    $(".color-picker-1 .sp-choose").click(function() {
      var color = colorHelper.rgbToObject($scope.settings.light1);

      apiService.updateLight(1, color.r, color.g, color.b);
    });
  });
});