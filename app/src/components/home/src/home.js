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
      controller: 'HomeCtrl'
    }
  );
});