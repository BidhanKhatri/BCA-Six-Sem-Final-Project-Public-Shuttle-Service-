const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position)=>{
          const{latitude,longitude} = position.coords;
          //sending the location to backend from frontend
          socket.emit("send-location", {latitude,longitude});
        },
    (error)=>console.log(error),
    {   
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0
    })
}

//L.map() is coming from Leaflet and wetView [0,0] for latitude and longitude and second parameter is for map zoom
const map = L.map("map").setView([0, 0], 16);

//It helps to set the map in dynamic position
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

//create a empty object marker
const markers = {}

socket.on("receive-location", (data)=>{
    const {id, latitude, longitude} = data;
    map.setView([latitude,longitude]);

    if(markers[id]){
        markers[id].setLatLng([latitude,longitude])
    }
    else{
        markers[id] = L.marker([latitude,longitude]).addTo(map);
    }
    
    //adding routes to go from one place to another (narayan gopal chowk to ratnapark) take the lat and lng value from database
    map.on('click',(e)=>{
        console.log(e);
        L.marker([27.7056,85.3136]).addTo(map);
    
        L.Routing.control({
            waypoints: [
                L.latLng(latitude,longitude), //from current location
                L.latLng(27.7056,85.3136) //to desired location
            ]
        }).addTo(map)
        
    });
    
})



