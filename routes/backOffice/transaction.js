var transaction=require('./../../models/transactionSchema');
var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
    transaction.find(function (err,transaction) {
        if(err){
            res.send(err);
        }
        if(!transaction){
            res.sendStatus(404);
        }
        else {
            res.json(transaction);
        }
    });


});
router.get('/:id',function (req,res,next){
    var id= req.params.id;
    transaction.findById(id).exec(function (err,transaction) {
        if(err){
            res.send(err);
        }
        if(!transaction){
            res.sendStatus(404);
        }
        else {
            res.json(transaction);
        }
    });
});
router.post('/',function (req,res) {
    var Transaction =new transaction(req.body);
    Transaction.save(function(err,Newtransaction){
        if (err)
            res.send(err);
        else
            res.send(Newtransaction);
    });
});
module.exports = router;
