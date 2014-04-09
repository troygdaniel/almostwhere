var Almost = Almost || {};

Almost.Device = function (options) {
  var roomId, socket, onUpdate
  var previousLocation =  {lat:-1, lng:-1};
  var currentLocation =   {lat:0, lng:0};
  var id = Almost.Device.getDeviceId();
  var deviceName = Almost.Device.fetchDeviceName();

  initialize(options);

  function initialize(opt) {
    // initialize with opt
    if (!opt) return;
    if (opt.roomId)   { roomId = opt.roomId; }
    if (opt.socket)   { socket = opt.socket; }
    if (opt.onUpdate) { onUpdate = opt.onUpdate; }
  }

  // Poll for location ever second
  setInterval(locationRequest,1000);

  // Request the devices location
  function locationRequest() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position){
        locationResponse(position.coords.latitude, position.coords.longitude);
      });
    }
  }

  // Device responds with geo location
  function locationResponse(lat, lng){
    currentLocation.lat=lat;
    currentLocation.lng=lng;

    // if (previousLocation != currentLocation)
    socket.emit('share_location:'+roomId, toJSON());
    previousLocation = currentLocation;
  }

  function toJSON() {
    return {
      id: id,
      n: deviceName,
      lt: currentLocation.lat,
      lg: currentLocation.lng
    }
  }
  function getLat() {
    return currentLocation.lat;
  }
  function getLng() {
    return currentLocation.lng;
  }
  return {
    toJSON: toJSON,
    getLat: getLat,
    getLng: getLng
  };
};

Almost.Device.getDeviceId = function () {
  var deviceId;
  
  deviceId = localStorage.getItem("deviceId");
  
  if (!deviceId) {
    deviceId = getGuid();
    localStorage.setItem("deviceId", deviceId);
  }
  
  return deviceId;
}
Almost.Device.fetchDeviceName = function() {
  var d = localStorage.getItem("deviceName");
  if (d === null || d === "undefined") d = "a friend";
  return d;
}
Almost.Device.saveDeviceName = function(d) {
  if (d === null || d === "undefined") d = "a friend";
  localStorage.setItem("deviceName", d);    
  return d;
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
   .toString(16)
   .substring(1);
};

function getGuid() {
  return s4()+s4()+s4()+s4();
}