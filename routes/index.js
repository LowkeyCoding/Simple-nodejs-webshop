//import
var express = require('express');
var router = express.Router();

//Import Handler
var Handler = require('../scriptPartials/handler');
var handler = new Handler();

/* GET home page. */
router.get('/', function(req, res, next) {
  handler.getProducts(req, res, next,3 );
});
/* GET add to cart. */
router.get('/add-to-cart/:id/:amount', function(req, res, next){
  handler.addToCart(req, res, next);
});
/* GET set the amount of a item page. */
router.get('/setItemAmount/:id/:amount',function(req, res, next){
  handler.setItemAmount(req, res, next);
});
/* GET remove item page. */
router.get('/remove/:id',function(req, res, next){
  handler.removeItem(req, res, next);
});
/* GET verify account page */
router.get('/verify/:id',function(req, res, next){
  handler.getVerifyEmail(req, res, next);
});
/* GET reset password page */
router.get('/reset/:secrect/:email', function(req, res, next){
  handler.getResetPassword(req, res, next);
})
/* GET send reset password */
router.get('/sendReset/:secrect/:email', function(req, res, next){
  handler.getResetPassword(req, res, next);
})
/* GET shoppingcart page. */
router.get('/shopping-cart', function(req, res, next){
  handler.getShoppingcart(req, res, next);
});
/* GET checkout page. */
router.get('/checkout',handler.isLoggedIn,function(req, res, next){
  handler.getCheckout(req, res, next);
});
router.get('/product/:id', function(req, res, next){
  handler.getProduct(req, res, next);
});
/* GET Privacy Policy page. */
router.get('/privacy-policy', function(req, res, next){
  handler.getPrivacyPolicy(req, res, next);
});
/* GET Refund Policy page. */
router.get('/refund-policy', function(req, res, next){
  handler.getRefundPolicy(req, res, next);
});
/* GET Terms of Service page. */
router.get('/terms-of-service', function(req, res, next){
  handler.getTermsOfService(req, res, next);
});
/* POST checkout page form. */
router.post('/checkout',handler.isLoggedIn,function(req, res, next){
  handler.postCheckout(req, res, next);
});
module.exports = router;

