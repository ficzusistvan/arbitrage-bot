// GENERAL DEPENDENCIES
import nconf from 'nconf'
nconf.file({
  file: 'config.json',
  search: true
});
import socketio from 'socket.io'

// DEBUGGING
import Debug from 'debug'
const debug = Debug('socketio')

// VARIABLES
const SOCKET_IO_PORT = nconf.get('ports:socket_io');

const io = socketio(SOCKET_IO_PORT);

io.on('connection', socket => {
  logger.info("Socket.io client connected", socket.id);

  socket.emit('msg', 'ez az');

  socket.on('disconnect', () => {
    logger.info("Socket.io client disconnected", socket.id);
  });
});
