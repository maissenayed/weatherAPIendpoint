var weatherData=require('./../models/weatherDataSchema');
var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
    weatherData.find(function (err,weatherData) {
        if(err) {
            res.send(err);
            console.log('err');
        }
        if(!weatherData) {
            res.status(404).send();
            console.log('weather_data');
        }
        else {
            //res.json({data:weatherData[0].main});
            res.json(weatherData)
            console.log('json');
        }
    });
});
router.post('/',function (req,res) {
    console.log( req.body);
    var newWeatherData=new weatherData(req.body);
    newWeatherData.save(function (err,newWeatherData) {
        if(err)
            res.send(err);
        else
            res.send(newWeatherData);
    });
});

module.exports = router;
