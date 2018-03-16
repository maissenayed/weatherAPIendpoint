var mongoose = require('mongoose');

var WeatherStationSchema=mongoose.Schema({
    status:String,
    age:Number,
    ip_adr:String,
    coord:{lng:Number,lat:Number,code:String}
});
module.exports =mongoose.model('weather_station',WeatherStationSchema);