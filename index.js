
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3001;

app.use(express.static(__dirname + '/public'));

//heroku features:enable http-session-affinity
//to work with socket io

function onConnection(socket){
  socket.on('drawing', function(data){
    socket.broadcast.emit('drawing', data);
    console.log(data);
  });
  
  socket.on('rectangle', function(data){
    socket.broadcast.emit('rectangle', data);
    console.log(data);
  });
  
  socket.on('linedraw', function(data){
    socket.broadcast.emit('linedraw', data);
    console.log(data);
  });
  
   socket.on('circledraw', function(data){
    socket.broadcast.emit('circledraw', data);
    console.log(data);
  });
  
  socket.on('ellipsedraw', function(data){
    socket.broadcast.emit('ellipsedraw', data);
    console.log(data);
  });
  
  socket.on('textdraw', function(data){
    socket.broadcast.emit('textdraw', data);
    console.log(data);
  });
  
  socket.on('copyCanvas', function(data){
    socket.broadcast.emit('copyCanvas', data);
    console.log(data);
  });
  
  socket.on('Clearboard', function(data){
    socket.broadcast.emit('Clearboard', data);
    console.log(data);
  });
 
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
