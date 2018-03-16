var mongoose = require('mongoose');

var UserSchema=mongoose.Schema({
    //trim :true means no spaces
    wallet_adr:{type:String,required:true,trim:true,unique:true},
    token_balance:{type:Number,required:true}
});
module.exports =mongoose.model('User',UserSchema);