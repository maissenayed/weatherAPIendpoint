var mongoose = require('mongoose');

var TransactionSchema=mongoose.Schema({
    sender_adr:String,
    contract_adr:String,
    selected_package:String,
    start_date:Date,
    end_date:Date,
    purchase_amount:Number,
    price:{week_price:String,ticket_price:String}
});
module.exports =mongoose.model('transaction',TransactionSchema);