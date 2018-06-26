const express = require('express');
var session = require('express-session');
var redis = require('redis');
var client = redis.createClient();
var RedisStore = require('connect-redis')(session); // this allow using Redis with express-session

var app = express();

// Use the session middleware
app.use(session({
  store: new RedisStore({client: client}), /* connect-redis client */
  secret: 'keyboard cat',
  cookie: { maxAge: 60000, secure: 'auto' },
  resave: false,
  saveUninitialized: false,
}));

// Access the session as req.session
app.get('/', function(req, res, next) {
  // console.log('here we go111');
  req.session.hello = 'Hi!';
  if (req.session.views) {
    req.session.views++
    res.setHeader('Content-Type', 'text/html')
    res.write('<p>views: ' + req.session.views + '</p>')
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
    // console.log('333');
    res.end()
    // console.log('444');
  } else {
    req.session.views = 1
    res.end('welcome to the session demo. refresh!')
  }
  // console.log('here we go222');
})



app.listen(3000, function(){
  console.log('Listening port 3000...');
})
