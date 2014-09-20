"use strict";

angular.module('app').controller('ColorPickerCtrl', function(
  $scope,
  $timeout,
  apiService,
  colorHelper,

  light1Color,
  light2Color
) {
  $scope.settings = {
    light1: light1Color,
    light2: light2Color
  };

  $timeout(function() {
    $(".color-picker-1 .sp-choose").click(function() {
      var color = colorHelper.rgbToObject($scope.settings.light1);

      apiService.updateLight(1, color.r, color.g, color.b);
    });

    $(".color-picker-2 .sp-choose").click(function() {
      var color = colorHelper.rgbToObject($scope.settings.light2);

      apiService.updateLight(2, color.r, color.g, color.b);
    });
  });
});