"use strict";

angular.module('app').controller('HomeCtrl', function(
  $scope,
  $timeout,
  $log,

  light1Color
) {
  $scope.light1 = {
    color: light1Color
  };

  // TODO: Integrate with backend server
  var socketUrl = "http://localhost:8000";
  var socket = io(socketUrl);

  socket.on('msg', function(msg){
    $log.log(msg);
  });
});