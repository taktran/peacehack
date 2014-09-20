var SocketIO = require('socket.io');
var _ = require('lodash');

var MIN_DELAY_TIME = 3 * 1000; // 10s
var MAX_DELAY_TIME = 10 * 1000; // 10s

function sendMessage(io, message, type, index) {
  var msgTitle = 'msg:' + type;
  io.emit(msgTitle, {
    msg: message,
    type: type,
    msgIndex: index
  });
}

function trickleData(io, data, type) {
  var currentIndex = 0;
  var sendMessageWithDelay = function() {
    sendMessage(io, data[currentIndex], type, currentIndex);


    var delay = _.random(MIN_DELAY_TIME, MAX_DELAY_TIME);
    // Send message again after delay
    _.delay(sendMessageWithDelay, delay);

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