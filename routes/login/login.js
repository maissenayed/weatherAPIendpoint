var express = require('express');
var User=require('./../../models/userSchema');
var passportoption = require("./../../libs/auth");
var jwt = require('jsonwebtoken');
var _ = require("lodash");
var ethUtil = require('ethereumjs-util');

var router = express.Router();
var users = [
    {
        id: 1,
        name: 'jonathanmh',
        password: '%2yx4'
    },
    {
        id: 2,
        name: 'test',
        password: 'test'
    }
];
router.post("/", function(req, res) {
    if(req.body.name && req.body.password){
        var username = req.body.name;
        var password = req.body.password;
    }
    // usually this would be a database call:
    var user = User.findOne({username: new RegExp('^'+username+'$', "i")}, function(err, doc) {
        if(err){
            res.send(err);
        }
        if(!doc){
            res.sendStatus(404);
        }else {
        doc.comparePassword(password, function(err, isMatch) {
            console.log("isMatch", isMatch);
           if (err) next(err);

            if (!isMatch) {
                res.status(401).json({message:"passwords did not match"});
            }else{
            // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
            var payload = {id: user.id};
            var token = jwt.sign(payload,passportoption.jwtOptions.secretOrKey);
            res.json({message: "ok", token: token});
            }
        });  }
    });




});
router.get("/secret", passportoption.passport.authenticate('jwt', { session: false }), function(req, res){
    res.json("Success! You can not see this without a token");
});
router.get("/secretDebug", function(req, res, next){
        console.log(req.get('Authorization'));
        next();
    }, function(req, res){
        res.json("debugging");
    });
router.post('/sign', (req, res, next) => {
    var owner_adr  =req.body.address;
    var sig  =req.body.signature;
    console.log('owner_adr: '+ owner_adr)
    console.log('signature: '+ sig)

    var data = '270bytes weather';
    var message = ethUtil.toBuffer(data);
    var msgHash = ethUtil.hashPersonalMessage(message);
    // Get the address of whoever signed this message
    var signature = ethUtil.toBuffer(sig);

    var sigParams = ethUtil.fromRpcSig(signature);
    var publicKey = ethUtil.ecrecover(msgHash, sigParams.v, sigParams.r, sigParams.s);
    var sender = ethUtil.publicToAddress(publicKey);
    var addr = ethUtil.bufferToHex(sender);

    // Determine if it is the same address as 'owner'
    var match = false;
    if (addr == owner_adr) { match = true; }
    res.render('sign.twig', {signature: sig, address: owner_adr , match: match});
});
module.exports=router;