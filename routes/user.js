//import modules
var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

//Import database models
var Order  = require('../models/order');
var Cart = require('../models/cart');

//Import scripts
var Handler = require('../scriptPartials/handler');
var handler = new Handler();

//activat mm-protection
var csrfProtection = csrf();
router.use(csrfProtection);

/* GET profile page*/
router.get('/profile', handler.isLoggedIn, function(req, res, next){
    handler.getProfile(req, res, next);
});

/* GET orders page. (last parameter is chunksize)*/
router.get('/orders', handler.isLoggedIn, function(req, res, next){
    handler.getOrders(req, res, next, 3);
});
/* GET Invoice page */
router.get('/invoice/:id', handler.isLoggedIn, function(req, res, next){
    handler.getInvoice(req, res, next);
});

/* GET logout page. */
router.get('/logout', handler.isLoggedIn,function(req, res, next){
    handler.logout(req, res, next);
});

//all paths below can only be accesed if the user is loggedout
router.use('/',handler.isLoggedOut, function(req, res, next){
    next();
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
    handler.getSignup(req, res, next);
});
  
/* GET signin page. */
router.get('/signin', function(req, res, next){
    handler.getSignin(req, res, next);
});
  
/* Handel POST on signup page. */
router.post('/signup', passport.authenticate('local.signup',{
    failureRedirect: '/user/signup',
    failureFlash: true
    }),handler.postSignup);
  
/* Handel POST on signin page. */
router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}),handler.postSignin);

module.exports = router;