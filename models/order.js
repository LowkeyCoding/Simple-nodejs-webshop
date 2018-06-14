var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref:'User'},
    cart: {type: Object, required: true},
    name: {type: String, required: true},
    adressLine1: {type: String, required: true},
    adressLine2: {type: String},
    city: {type: String, required: true},
    state: {type: String, required: true},
    postalCode: {type: String, required: true},
    country: {type: String, required: true},
    paymentId: {type: String, required: true},
    date: {type: String, required: true},
    status: {type: String, required: true},
    alixpressOrderId: {type: String},
    shippingNumber: {type: String}
});

module.exports = mongoose.model('Order', schema);


