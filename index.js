//communication with phone
var weather = require('./weather');
var emissions = require('./emissions');
var helper = require('./helper');
var a = require('./app');
var Q = require('q');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var sgLocation = { "latitude": 1.3059, "longitude": 103.7913 };


app.get('/', function(req, res){
  res.send('<script src="/socket.io/socket.io.js"></script><script>var socket = io();</script><h1>Hello world</h1>');
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    
    socket.on('forecast', function(msg){
        var latlng = msg.split('_');
        var userLoc = { "latitude": latlng[0]*1, "longitude": latlng[1]*1 };
        a.forecastInfo(userLoc, new Date()).done(function(weather) {
            console.log(weather);
            socket.emit('forecast_data', weather);
        });
    });
    
    socket.on('emissions', function(msg) {
        emissions.getEmissions().done(function(emis) {
            console.log(emis);
            socket.emit('emissions_data', emis);
        });
    });
              
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});