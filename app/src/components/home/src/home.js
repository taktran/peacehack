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
      url: '/?view',
      controller: 'HomeCtrl',
      resolve: {
        light1Color: function(
          colorHelper
        ) {
          return colorHelper.getColor("1");
        },
        light2Color: function(
          colorHelper
        ) {
          return colorHelper.getColor("2");
        }
      }
    })
    .state('homeAll', {
      templateUrl: 'components/home/templates/home-all.html',
      url: '/all',
      controller: 'HomeCtrl',
      resolve: {
        light1Color: function(
          colorHelper
        ) {
          return colorHelper.getColor("1");
        }
      }
    });
});