var express = require('express');
//var passportoption = require("./../../libs/auth");
var auth = require("./../../libs/authentication");
passport = require('passport');
var _ = require("lodash");
var ethUtil = require('ethereumjs-util');

var router = express.Router();

router.post("/", auth.login);


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