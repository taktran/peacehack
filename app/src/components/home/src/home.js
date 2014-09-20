"use strict";

angular.module('app').config(function(
  $stateProvider,
  $urlRouterProvider
) {

  // Redirect to root if unknown url
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      templateUrl: 'components/home/templates/home.html',
      url: '/',
      controller: 'HomeCtrl',
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