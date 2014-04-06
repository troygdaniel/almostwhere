//RoomPage
var roomPage, device;

// Page init
$(function() {  
  roomPage = new RoomPage();
  var deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = getGuid();
    localStorage.setItem("deviceId", deviceId);
  }
  var now = new Date();

  var deviceOptions = {
    id: deviceId,
    roomId: roomPage.id,
    socket: socket,
    onUpdate: function(lat, lng) {
      now = new Date();
      $("#coords").html(lat+" ,"+lng);
    }
  };

  device = new Almost.Device(deviceOptions);

  socket.on('share_location_changes:' + roomPage.id, function(data) {
      console.log("received update from " + data.id);
      var dist = distanceFrom(device.getLat(), device.getLng(), data.lt, data.lg);
      // $("#other_device").text(data.id);
      if (dist < 1) {
        $("#other_device").text(parseInt(dist*1000)+"m");
      }
      else
        $("#other_device").text(parseInt(dist)+"km");
    });
});


function RoomPage (options) {
  var id = location.search.substr(1, location.search.length);
  return {
    id: id
  }
}

  function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
           .toString(16)
           .substring(1);
  };

  function getGuid() {
      return s4()+s4()+s4()+s4();
  }

/*
http://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
*/

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function distanceFrom(lat1,lon1,lat2,lon2) {
  console.log("lat1 = " +lat1);
  console.log("lon1 = " +lon1);
  console.log("lat2 = " +lat2);
  console.log("lon2 = " +lon2);

var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}
