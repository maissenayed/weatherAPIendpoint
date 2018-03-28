var express = require('express');
var User=require('./../../models/userSchema');
var passportoption = require("./../../libs/auth");
var jwt = require('jsonwebtoken');
var _ = require("lodash");
var passport = require("passport");
var passportJWT = require("passport-jwt");
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
router.get("/secretDebug",
    function(req, res, next){
        console.log(req.get('Authorization'));
        next();
    }, function(req, res){
        res.json("debugging");
    });
module.exports=router;