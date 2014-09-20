var SocketIO = require('socket.io');

module.exports = {
  /**
   * Start socket io server
   *
   * @param  {Object} server Hapi server
   * @return {Object} Socket io server
   */
  start: function(server) {
    var io = SocketIO.listen(server.listener);

    io.on('connection', function(socket){
      console.log('a user connected');
      io.emit('msg', {
        data: "hello"
      });

      socket.on('disconnect', function(){
        console.log('user disconnected');
      });
    });

    return io;
  }
};