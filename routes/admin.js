//import modules
var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

//Import database models
var Order  = require('../models/order');

//Import scripts
var Handler = require('../scriptPartials/handler');
var handler = new Handler();

/* GET admin page. */
router.get('/admin-panel', handler.isAdmin, function(req, res, next){
    handler.getAdmin(req, res, next);
});
/* GET order processing page. */
router.get('/orderprocessing', handler.isAdmin, function(req, res, next){
    handler.getOrderProcessing(req, res, next);
});
/* GET order shipping page. */
router.get('/ordershipping', handler.isAdmin, function(req, res, next){
    handler.getOrderShipping(req, res, next);
});
/* GET remove product page. 4th value is product chunk size*/
router.get('/removeproduct', handler.isAdmin, function(req, res, next){
    handler.getRemoveProduct(req, res, next, 3);
});
/* GET add product page. */
router.get('/addproduct', handler.isAdmin, function(req, res, next){
    handler.getAddProduct(req, res, next);
});
/* GET update product page. */
router.get('/updateproduct', handler.isAdmin, function(req, res, next){
    handler.getUpdateProduct(req, res, next, 3);
});
/* GET remove product(no visuals)*/
router.get('/removeproduct/:id', handler.isAdmin, function(req, res, next){
    handler.postRemoveProduct(req, res, next);
});
/* POST add product page. */
router.post('/addproduct', handler.isAdmin, function(req, res, next){
    handler.postAddProduct(req, res, next);
});
router.post('/updateproduct/:id', handler.isAdmin, function(req, res, next){
    handler.postUpdateProduct(req, res, next);
});
/* SET(s) the aliexpress order id and changes the status. */
router.get('/setstatus/:id/:aid', handler.isAdmin, function(req, res, next){
    var status = 'Getting shipping number';
    handler.setStatus(req, res, next, status);
    handler.setAliexpressOrderId(req, res, next);
});
/* SET(s) the shipping number and changes the status. */
router.get('/setshippingnumber/:id/:sn', handler.isAdmin, function(req, res, next){
    var status = 'Shipped';
    handler.setStatus(req, res, next, status);
    handler.setShippingNumber(req, res, next);
});

module.exports = router;