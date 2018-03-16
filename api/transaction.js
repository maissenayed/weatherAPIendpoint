var transaction=require('./../models/transactionSchema');
var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
    transaction.find(function (err,transaction) {
        if(err) {
            res.send(err);
            console.log('err');
        }
        if(!transaction) {
            res.status(404).send();
            console.log('weather_data');
        }
        else {
            res.json(transaction);
            console.log('json');
        }
    });
});

module.exports = router;
