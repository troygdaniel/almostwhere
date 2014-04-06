var Almost = Almost || {};

Almost.Device = function (options) {
  var id, roomId, socket, onUpdate
  var previousLocation =  {lat:-1, lng:-1};
  var currentLocation =   {lat:0, lng:0};

  initialize(options);

  function initialize(opt) {
    // initialize with opt
    if (!opt) return;
    if (opt.id)       { id = opt.id; }
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

    // if (previousLocation != currentLocation) {
      if (onUpdate) onUpdate(lat,lng);
    // }
    socket.emit('share_location:'+roomId, toJSON());

    previousLocation = currentLocation;
  }

  function toJSON() {
    return {
      id: id,
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