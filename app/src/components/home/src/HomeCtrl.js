"use strict";

angular.module('app').controller('HomeCtrl', function(
  $scope,
  $timeout,

  light1Color
) {
  $scope.light1 = {
    color: light1Color
  };
});