// Page init
$(function() {  
  var roomPage = new RoomPage();
  var device = new Almost.Device({ roomId: roomPage.id, socket: socket });
  roomPage.listenForUpdates(device);
});

function RoomPage (options) {
  var id = location.search.substr(1, location.search.length);

  // Receive updates from web sockets
  function listenForUpdates(device) {
    
    socket.on('share_location_changes:' + id, function(data) {
        var dist = distanceFrom(device.getLat(), device.getLng(), data.lt, data.lg);
        var deviceName = data.n;
         // var dist = distanceFrom(43.441559, -79.7486979, data.lt, data.lg);

        document.title = "almost where | " + deviceName;        
        $("#medium_text").html("from <br/>" + deviceName);
        
        if (dist < 1) 
          $("#large_text").text(parseInt(dist*1000)+"m");      
        else 
          $("#large_text").text(dist.toFixed(2)+" km");

        if (dist > 500) $("#large_text").text(":-(");

      });
  }
  
  // Calculate the distance between two coordinates
  function distanceFrom(lat1,lon1,lat2,lon2) {    
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a =  Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }  
  return {
    id: id,
    listenForUpdates: listenForUpdates
  }

  // Math Rad function
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  } 

}

