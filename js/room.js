//RoomPage
var roomPage, device;

// Page init
$(function() {  
  roomPage = new RoomPage();
  var deviceId = getDeviceId()
  var deviceName = getDeviceName();
  var now = new Date();
  document.title = "almost where | " + deviceName;
  var deviceOptions = {
    id: deviceId,
    deviceName: deviceName,
    roomId: roomPage.id,
    socket: socket
  };

  device = new Almost.Device(deviceOptions);

  // Receive updates from web sockets
  socket.on('share_location_changes:' + roomPage.id, function(data) {

      var dist = distanceFrom(device.getLat(), device.getLng(), data.lt, data.lg);
       // var dist = distanceFrom(43.441559, -79.7486979, data.lt, data.lg);
      var deviceName = data.n;
      document.title = "almost where | " + deviceName;
      $("#medium_text").html("from <br/>" + deviceName);
      if (dist < 1) 
        $("#large_text").text(parseInt(dist*1000)+"m");      
      else 
        $("#large_text").text(dist.toFixed(2)+" km");

      if (dist > 500)
        $("#large_text").text(":-(");

    });
});

function getDeviceId() {
  var deviceId;
  deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = getGuid();
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
}

function getDeviceName() {
  var deviceName = localStorage.getItem("deviceName");
  if (deviceName === null || deviceName === "deviceName") deviceName = "";
  deviceName = prompt("Please name this device",deviceName);
  localStorage.setItem("deviceName", deviceName);
  return deviceName;
}

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

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function distanceFrom(lat1,lon1,lat2,lon2) {
  
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
