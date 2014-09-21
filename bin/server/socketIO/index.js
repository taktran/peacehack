var SocketIO = require('socket.io');
var _ = require('lodash');
var spark = require('../spark');
var sentiment = require('sentiment');

var MIN_DELAY_TIME = 3 * 1000; // 10s
var MAX_DELAY_TIME = 10 * 1000; // 10s

// function randomColor(lightId) {
//   return spark.randomLight(lightId).then(function(data) {
//     // Do nothing
//   }, function(e) {
//     console.error("random error", e);
//   });
// }

function changeColor(lightId, color) {
  return spark.changeLight(lightId, color).then(function(data) {
    console.log(data);
  }, function(e) {
    console.error("color change error", e);
  });
}

function changeSentimentColor(lightId, sentimentVal) {
  var color;

  if (sentimentVal < 0) {
    // Turn red
    color = {
      r: 137,
      g: 0,
      b: 0
    };
  } else if (sentimentVal === 0) {
    // Turn white
    color = {
      r: 150,
      g: 150,
      b: 150
    };
  } else if (sentimentVal > 0) {
    // Turn blue
    color = {
      r: 2,
      g: 116,
      b: 143
    };
  } else {
    // Black
    color = {
      r: 0,
      g: 0,
      b: 0
    };
  }

  changeColor(lightId, color);

  return color;
}

function sendMessage(io, message, type, index) {
  var msgTitle = 'msg:' + type;
  var sentimentVal = sentiment(message.content);
  var color;

  // TODO: Change to currently selected
  if (type === "war") {
    color = changeSentimentColor("1", sentimentVal.score);
  } else if (type === "peace") {
    color = changeSentimentColor("2", sentimentVal.score);
  }

  io.emit(msgTitle, {
    msg: message,
    type: type,
    msgIndex: index,
    sentiment: sentimentVal,
    color: color
  });
}

function trickleData(io, data, type) {
  var currentIndex = 0;
  var sendMessageWithDelay = function() {
    sendMessage(io, data[currentIndex], type, currentIndex);

    var delay = _.random(MIN_DELAY_TIME, MAX_DELAY_TIME);
    // Send message again after delay
    _.delay(sendMessageWithDelay, delay);

    // Loop index around when it's at the end
    currentIndex = currentIndex < data.length - 1 ? currentIndex + 1 : 0;
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

    // Create a web socket stream for each data
    // feed
    _.each(dataPromises, function(dataPromise, key) {
      dataPromises[key].then(function(resp) {
        var data = resp.data;
        console.log(key + " data:", data.length);

        trickleData(io, data, key);
      }, function(e) {
        server.log(["error", "data", key], e);
      });
    });

    return io;
  }
};