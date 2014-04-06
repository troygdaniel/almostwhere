// var connect = require('connect');
// connect.createServer(connect.static(__dirname)).listen(3000);
var express = require('express');
// var app = express();

var app = require('http').createServer(handler),
  io = require('socket.io').listen(app),
  fs = require('fs')
  url = require('url')
  app.listen(3000);

// Handle HTTP request/response
function handler(req, res) {
  var parsedURL = url.parse(req.url);
  var roomId = parsedURL.query;
  var pathName = parsedURL.pathname;

  // Create a websocket if a room/noteid was provided
  if (pathName === "/room") {
    pathName = "/room.html";
    roomId = parsedURL.query;
    createSocketForRoom(roomId);
    // console.log("roomId = " + roomId);
  }
  
  if (pathName === "/") pathName = "/index.html";
  // Read the request and respond with file 
  fs.readFile(__dirname + pathName, function(err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + pathName);
      }
      res.writeHead(200);
      res.end(data);
  });
}

// Create a web socket binding for a given room/noteId
function createSocketForRoom(roomId) {
  io.sockets.on('connection', function(socket) {
      // subscribe to "share_note:1234"
      socket.on('share_location:' + roomId, function(data) {
        // publish message to "shared_note_changes:1234" event
        // console.log(">>> share_location_changes:" + roomId + ", data = "+ data);
        socket.broadcast.emit('share_location_changes:' + roomId, data);
      });
  });
}