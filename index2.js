// this example with socket.io
const express = require('express');
var session = require('express-session');
var redis = require('redis');
var RedisStore = require('connect-redis')(session); // this allow using Redis with express-session
session = session({
  store: new RedisStore(), /* connect-redis client */
  secret: 'keyboard cat',
  cookie: { maxAge: 600000, secure: 'auto' },
  resave: false,
  saveUninitialized: false,
});
var sharedsession = require("express-socket.io-session");
var io = require('socket.io');

var app = express();

var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// Use the session middleware
app.use(session);

// Access the session as req.session
app.get('/', function(req, res, next) {

  if(req.session.views){
    req.session.views++;
  } else {
    req.session.views = 1;
  }
  console.log('req.session.views = ' + req.session.views);
  res.sendFile(__dirname + '/index.html');
})



var http = require('http');
http = http.Server(app);
http.listen(3000);
var io = io(http);

io.use(sharedsession(session, {
    autoSave:true
}));

io.on('connection', function(socket){
  console.log('connected ' + socket.id);

  if(socket.handshake.session.views){
    socket.handshake.session.views++;
  } else {
    socket.handshake.session.views = 1;
  }

  socket.emit('message', socket.handshake.session.views);

  socket.on('pluss_one', function(msg){
    socket.handshake.session.views++;
    socket.emit('message', socket.handshake.session.views);
    socket.handshake.session.save();
    console.log(msg);
  });

  socket.on('set_zero', function(msg){
    socket.handshake.session.views = 0;
    socket.emit('message', socket.handshake.session.views);
    socket.handshake.session.save();
    console.log(msg);
  })

})
