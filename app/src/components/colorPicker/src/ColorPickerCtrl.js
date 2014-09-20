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

  $timeout(function() {
    $(".color-picker-1 .sp-choose").click(function() {
      var color = colorHelper.rgbToObject($scope.settings.light1);

      apiService.updateLight(1, color.r, color.g, color.b);
    });
  });
});