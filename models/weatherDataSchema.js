var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var WeatherDataSchema=new Schema({
    coord:{lng:Number,lat:Number,code:String},
    sys:{country:String,sunrise:String,sunset:String},
    weather:{id:Number,main:String,description:String},
    main:{temp:Number,humidity:Number,pressure:Number}
});
module.exports =mongoose.model('weather_data',WeatherDataSchema);