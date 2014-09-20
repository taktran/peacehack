var SocketIO = require('socket.io');
var _ = require('lodash');

var DELAY_TIME = 10 * 1000; // 10s

function sendMessage(io, message, type, index) {
  io.emit('msg', {
    msg: message,
    type: type,
    msgIndex: index
  });
}

function trickleData(io, data, type) {
  var currentIndex = 0;
  var sendMessageWithDelay = function() {
    sendMessage(io, data[currentIndex], type, currentIndex);

    // Send message again after delay
    _.delay(sendMessageWithDelay, DELAY_TIME);

    // Loop index around
    currentIndex = currentIndex < data.length ? currentIndex + 1 : 0;
  };

  sendMessageWithDelay();
}

module.exports = {
  /**
   * Start socket io server
   *
   * @param  {Object} server Hapi server
   * @return {Object} Socket io server
   */
  start: function(server, root) {
    var io = SocketIO.listen(server.listener);

    io.on('connection', function(socket) {
      console.log('a user connected');
      socket.on('disconnect', function(){
        console.log('user disconnected');
      });
    });

    var dataPromises = require('./data')(root);

    dataPromises.war.then(function(resp) {
      var data = resp.data;
      trickleData(io, data, "war");
    }, function(e) {
      server.log(["error", "data"], e);
    });

    dataPromises.peace.then(function(resp) {
      var data = resp.data;
      trickleData(io, data, "peace");
    }, function(e) {
      server.log(["error", "data"], e);
    });

    return io;
  }
};