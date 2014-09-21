"use strict";

angular.module('app').controller('HomeCtrl', function(
  $scope,
  $timeout,
  $log,
  CONFIG,

  light1Color,
  light2Color
) {
  $scope.lights = {
    color1: light1Color,
    color2: light2Color
  };

  $log.log($scope.lights);

  // TODO: Integrate with backend server
  var socketUrl = "http://localhost:8000";
  var socket = io(socketUrl);

  $scope.currentMsg = {};
  $scope.msgTypes = CONFIG.msgTypes;
  $scope.currentMsgType = {
    type1: $scope.msgTypes[0],
    type2: $scope.msgTypes[1],
  };

  $scope.bgColor = function(color) {
    if (!_.isObject(color)) {
      return "";
    }

    return "background-color: rgb(" + color.r + "," + color.g + "," + color.b + ");";
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
      $log.log(msg);
      $timeout(function() {
        $scope.currentMsg[type] = msg;
      });
    });
  });
});