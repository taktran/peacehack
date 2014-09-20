"use strict";

angular.module('app').controller('HomeCtrl', function(
  $scope,
  $timeout,
  $log,
  CONFIG,

  light1Color
) {
  $scope.light1 = {
    color: light1Color
  };

  $log.log($scope.light1);

  // TODO: Integrate with backend server
  var socketUrl = "http://localhost:8000";
  var socket = io(socketUrl);

  $scope.currentMsg = {};
  $scope.msgTypes = CONFIG.msgTypes;
  $scope.currentMsgType = {
    type1: $scope.msgTypes[0],
    type2: $scope.msgTypes[1],
  };

  $scope.$watch('currentMsgType', function() {
    // Hide all
    _.each($scope.show, function(val, key) {
      $scope.show[key] = false;
    });
  }, true);

  // Set up sockets for the different message
  // types
  _.each($scope.msgTypes, function(type) {
    var msgTitle = 'msg:' + type;
    socket.on(msgTitle, function(msg) {
      // $log.log(msg);
      $timeout(function() {
        $scope.currentMsg[type] = msg;
      });
    });
  });
});