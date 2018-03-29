var jwt = require('jsonwebtoken');
var User = require('../models/userSchema');
var authConfig = require('./jwtConfig');

/*function generateToken(user){
    return jwt.sign(user, authConfig.secret, {
        expiresIn: 10080
    });
}
*/
function setUserInfo(request){
    return {
        _id: request._id,
        username: request.username,
        role: request.role
    };
}

exports.login = function(req, res, next){

    if(req.body.name && req.body.password){
        var username = req.body.name;
        var password = req.body.password;
    }
    // usually this would be a database call:
     User.findOne({username: new RegExp('^'+username+'$', "i")}, function(err, user) {
        if(err){
            res.send(err);
        }
        if(!user){
            res.sendStatus(404);
        }else {
            user.comparePassword(password, function(err, isMatch) {
                console.log("isMatch", isMatch);
                if (err) next(err);

                if (!isMatch) {
                    res.status(401).json({message:"passwords did not match"});
                }
            });
            let userInfo = setUserInfo(user);
            let token = jwt.sign(userInfo,authConfig.jwtOptions.secretOrKey);
            res.json({message: "ok", token: token,userInfo:userInfo});
        }
    });
    /*var userInfo = setUserInfo(req.user);

    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });*/

}

exports.register = function(req, res, next){

    var email = req.body.email;
    var password = req.body.password;
    var role = req.body.role;

    if(!email){
        return res.status(422).send({error: 'You must enter an email address'});
    }

    if(!password){
        return res.status(422).send({error: 'You must enter a password'});
    }

    User.findOne({email: email}, function(err, existingUser){

        if(err){
            return next(err);
        }

        if(existingUser){
            return res.status(422).send({error: 'That email address is already in use'});
        }

        var user = new User({
            email: email,
            password: password,
            role: role
        });

        user.save(function(err, user){

            if(err){
                return next(err);
            }

            let userInfo = setUserInfo(user);
            let token = jwt.sign(userInfo,authConfig.jwtOptions.secretOrKey);
            res.json({message: "ok", token: token,userInfo:userInfo});

        });

    });

}

exports.roleAuthorization = function(roles){

    return function(req, res, next){
        let user = req.user;
       console.log(user);
        User.findById(user._id, function(err, foundUser){

            if(err){
                res.status(422).json({error: 'No user found.'});
                return next(err);
            }

            if(roles.indexOf(foundUser.role) > -1){
                return next();
            }else {

                res.status(401).json({error: 'You are not authorized to view this content'});

            }

        });

    }

}