"use strict";

angular.module('app').config(function(
  $stateProvider,
  $urlRouterProvider
) {
  $stateProvider
    .state('colorPicker', {
      templateUrl: 'components/colorPicker/templates/colorPicker.html',
      url: '/admin',
      controller: 'ColorPickerCtrl',
      resolve: {
        light1Color: function(
          colorHelper
        ) {
          return colorHelper.getColor("1");
        }
      }
    }
  );
});