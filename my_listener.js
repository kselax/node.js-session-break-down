const express = require('express');

var app = express();

app.use(function(req, res, next){
  // 1. get data from database and put to req.my_session
  req.my_session = {}
  req.my_session.views = 1;
  console.log(req.my_session.views);

  res.end = createEnd(res.end);

  // creating a closure function
  function createEnd(prevEnd){
    var flag = false;
    return function end(){
      // console.log(this);
      // prevent multiple times execute our code
      if(!flag){
        flag = true;
        console.log('===Here our listener===');
        console.log(req.my_session.views);
      }
      prevEnd.apply(this, arguments);
    }
  } // function createEnd(prevEnd){

  next();
});


app.get('/', function(req, res){
  console.log('begin plus = ' + req.my_session.views);
  req.my_session.views = req.my_session.views + 10;
  console.log('after plus = ' + req.my_session.views);

  //save to database
  console.log('begin Hi!');
  res.send('Hi!');
  res.end();
  console.log('after Hi!');
});


app.listen(3000);
