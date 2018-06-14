//Import databasemodels
const Order  = require('../models/order');
const Cart = require('../models/cart');
const Product = require('../models/product');
const User = require('../models/user');

//Import modules
const bcrypt = require('bcrypt-nodejs');
const emailHandler = require('./emailHandler');
const eHandler = new emailHandler();
const config = require("../config/config");

//helper functions
//gets the current date 
function date(){
    var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1;
        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        }
    return dd+'/'+mm+'/'+yyyy;
}
module.exports = function handler() {
    //gets all website products and create a chunk structure so its easy to render.
    this.getProductChunks = function(req, res, next, _chunkSize, page, title){
        var successMsg = req.flash('success')[0];
        Product.find(function(err, docs){
          var productChunks = [];
          var chunkSize = _chunkSize;
          for (i = 0; i< docs.length; i+=chunkSize){
              productChunks.push(docs.slice(i,i + chunkSize));
          }
          res.render(page, {title: title, products: productChunks, successMsg: successMsg, noMessage: !successMsg});
        });
    }
    this.getProduct = function(req, res, next){
        var id = req.params.id;
        Product.find({_id: id}, function(err, docs){
            res.render('shop/product', {title: docs[0].title, product: docs[0]})
        });
    }
    //Gets the Privacy Policy page
    this.getPrivacyPolicy = function(req, res, next){
        res.render('legal/privacypolicy', {title: config.title_Privacy_policy });
    };
    //Gets the Refund Policy page
    this.getRefundPolicy = function(req, res, next){
        res.render('legal/refundpolicy', {title: config.title_Refund_policy });
    };
    //Gets the Terms of Service page
    this.getTermsOfService = function(req, res, next){
        res.render('legal/termsofservice', {title: config.title_Terms_of_service });
    };
    //Gets all products and lines them up in chunks specified by _chunksize
    this.getProducts = function(req, res, next, _chunkSize) {
        this.getProductChunks(req, res, next, _chunkSize, 'shop/index', config.title_Sitename);
    };
    //Gets the profile page
    this.getProfile = function (req, res, next){
        res.render('user/profile', {title: config.title_Profile })
    };
    //Updates the user information
    this.updateProfile = function(req, res, next){
        var id = req.user._id;
        User.updateOne({_id: id},function(err, result){
            if(err){
                res.write(err);
            }
            else{
                res.redirect('/user/profile')
            }
        });
    };
    //Gets all user orders and lines them up in chunks specified by _chunksize
    this.getOrders = function (req, res, next, _chunkSize) {
        Order.find({user: req.user}, function(err, orders) {
            if (err) {
                return res.write('Error!');
            }
            var cart;
            var orderChunks = [];
            var chunkSize = _chunkSize;
            for (i = 0; i < orders.length; i+=chunkSize){
                orderChunks.push(orders.slice(i,i + chunkSize));
            }
            orders.forEach(function(order) {
                cart = new Cart(order.cart);
                order.items = cart.generateArray();
            });
            res.render('user/orders', {title: config.title_Orders, orders: orderChunks });
        });
        Order.find(function(err, docs){
            var orderChunks = [];
            var chunkSize = _chunkSize;
            for (i = 0; i < docs.length; i+=chunkSize){
                orderChunks.push(docs.slice(i,i + chunkSize));
            }
            //res.render('user/orders', { orders: orderChunks });
        });
    };
    //Checks if user is loggedin. if user tried to access login proteced page it will redirect to it when user signup/signin 
    this.isLoggedIn = function(req, res, next){
        if (req.isAuthenticated()) {
             return next();
        }
        req.session.oldUrl = req.originalUrl;
        res.redirect('/user/signin');
    };
    //Check if user is loggedout and redirects away from page if user is loggedout.
    this.isLoggedOut = function(req, res, next){
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    };
    //Checks if user is admin
    this.isAdmin = function(req, res, next){
        var user = req.user;
        var arr = Object.keys(user).map(function(key) {
            return [Number(key), user[key]];
        });
        var adminStatus = arr[3][1].admin;
        if (adminStatus === 1){
            return next();
        }
        res.redirect('/');
    };
    //Gets the admin dashboard
    this.getAdmin = function(req, res, next){
        res.render('admin/admin-panel', {title: config.title_Admin_panel});
    };
    //Gets the admin page for adding aliexpress order id
    this.getOrderProcessing = function(req, res, next){
        Order.find({status: 'processing'}, function(err, orders) {
            if (err) {
                return res.write('Error!');
            }
            else{
                res.render('admin/orderprocessing', {title: config.title_Order_processing, orders: orders})
            }
        });
    };
    //Get the admin page for adding shipping number
    this.getOrderShipping = function(req, res, next){
        Order.find({alixpressOrderId: { $exists: true }}, function(err, orders) {
            if (err) {
                return res.write('Error!');
            }
            else{
                res.render('admin/ordershipping', {title: config.title_Order_shipping, orders: orders})
            }
        });
    };
    //Get the admin page for adding new products
    this.getAddProduct = function(req, res, next){
        res.render('admin/addproduct', {title: config.title_Add_product, });
    };
    //Get the admin page for adding new products
    this.getRemoveProduct = function(req, res, next, _chunkSize){
        this.getProductChunks(req, res, next, _chunkSize, 'admin/removeproduct', config.title_Remove_product);
    };
    //Set the order status to what is in the 4th parameter(status)
    this.setStatus = function(req, res, next,status){
        var id = req.params.id;
        var status = status;
        Order.updateOne({_id: id}, {$set:{status: status}}, function(err, result){

        });
    };
    //Set the ordersaliexpress id, using the form on /admin/orderprocessing
    this.setAliexpressOrderId = function(req, res, next){
        var id = req.params.id;
        var alixpressOrderId = req.params.aid;
        Order.updateOne({_id: id}, {$set:{alixpressOrderId: alixpressOrderId.toString()}}, function(err, result){
            res.redirect('/admin/orderprocessing');
        });
    };
    //Set the order shipping number, using the form on /admin/ordershipping
    this.setShippingNumber = function(req, res, next){
        var id = req.params.id;
        var shippingNumber = req.params.sn;
        Order.updateOne({_id: id},{$set:{shippingNumber: shippingNumber.toString()}}, function(err, result){
            res.redirect('/admin/ordershipping');
        });
    };
    //adds item to cart
    this.addToCart = function(req, res, next){
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        Product.findById(productId, function(err, product){
          if (err){
            return res.redirect('/')
          }
          cart.setAmount(product, product.id, req.params.amount);
          req.session.cart = cart;
          res.redirect('/shopping-cart');
        })
    };
    //removes a single item from shopping cart
    this.setItemAmount = function(req, res, next){
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        Product.findById(productId, function(err, product){
            if (err){
              return res.redirect('/')
            }
            cart.setAmount(product, product.id, req.params.amount);
            req.session.cart = cart;
            res.redirect('/shopping-cart');
          })
    };
    //removes all of a item from cart
    this.removeItem = function(req, res, next){
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        cart.remove(productId);
        req.session.cart = cart;
        res.redirect('/shopping-cart');
    };
    //gets the shoppingcart page
    this.getShoppingcart = function(req, res, next){
        if (!req.session.cart){
          return res.render('shop/shopping-cart', {title: config.title_Shopping_cart, products: null});
        }
        var cart = new Cart(req.session.cart);
        res.render('shop/shopping-cart', {title: config.title_Shopping_cart, products: cart.generateArray(), totalPrice: cart.totalPrice});
    };
    //gets the checkout page
    this.getCheckout = function(req, res, next){
        if (!req.session.cart){
          return res.redirect('shop/shopping-cart');
        }
        var cart = new Cart(req.session.cart);
        var errMsg = req.flash('error')[0];
        res.render('shop/checkout', {title: config.title_Checkout, total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
    };
    //post the checkout page (Creates transaction)
    this.postCheckout =function(req, res, next){
        if (!req.session.cart){
          return res.render('shop/shopping-cart', {products: null});
        }
        var cart = new Cart(req.session.cart);
        var stripe = require("stripe")(
          "sk_test_AMhxOUK5kVugfnbmm5koivgv"
        );
        stripe.charges.create({
          amount: cart.totalPrice * 100,
          currency: "usd",
          source: req.body.token,
          description: "Thank you for ordering from webshop",
          receipt_email: res.locals.user.email.toString()
        }, function(err, charge) {
          if(err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
          }
          var order = new Order({
            user: req.user,
            cart: cart,
            name: req.body.name,
            adressLine1: req.body.adressLine1,
            adressLine2: req.body.adressLine2,
            city: req.body.city,
            state: req.body.state,
            postalCode: req.body.postalCode,
            country: req.body.country,
            paymentId: charge.id,
            date: date(),
            status: 'processing'
          })
          order.save(function(err, result){
            if(err) {
              req.flash('error', err.message);
              return res.redirect('/checkout');
            }
            req.flash('success', 'Successfully bought produt(s)');
            req.session.cart = null;
            res.redirect('/');
          });
        });
    };
    //Logs the user out using passport
    this.logout = function(req, res, next){
        req.logOut();
        res.redirect('/');
    };
    //Gets the signup page
    this.getSignup = function(req, res, next){
        var messages = req.flash('error');
        res.render('user/signup',{title: config.title_Signup, csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
    };
    //Gets the signin page
    this.getSignin = function(req, res, next){
        var messages = req.flash('error');
        res.render('user/signin',{title: config.title_Signin, csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
    };
    //Posts the signup form
    this.postSignup = function(req, res, next){
            let id = req.user._id;   
            let email = req.user.email;
            let hostname = req.hostname;
            if (req.session.oldUrl){
                var oldUrl = req.session.oldUrl;
                req.session.oldUrl = null;
                res.redirect(oldUrl);
            }
            else{
                res.redirect('/verification')
            }
    };
    //email verifciation
    this.getVerifyEmail = function(req, res, next){
        let id = req.params.id;
        User.findById(id, function(err, user){
            User.update({_id: id}, {$set:{activated: true}}, function(err, result){
                if(err){
                    res.write(err);
                }
                else{
                    if(user.activated == true){
                        if (req.session.oldUrl){
                            var oldUrl = req.session.oldUrl;
                            req.session.oldUrl = null;
                            res.redirect(oldUrl);
                        }
                        else{
                            res.redirect('/')
                        }
                    }
                    else{
                        res.redirect('/user/signin')
                    }
                }
            });
        });
    };
    this.sendResetPassword = function(req, res, next){
        let email = req.body.email;
        let hostname = req.hostname;
        User.findOne({email: email}, function(err, res){
            console.log(res);
            eHandler.sendPasswordReset(res._id, res.email, res.password, hostname);
        });
    };
    this.getResetPassword = function(req, res, next){
       res.render('resetPassword',{secrect: req.params.secrect, email: req.params.email});
    };
    this.postResetPassword = function(req, res, next){
        let secrect = req.params.secrect;
        let email = req.params.email;
        User.findOne({email: email}, function(err, res){
            console.log(res);
            let same = bcrypt.compareSync(secrect,res.password)
            if (same == true){
               let p1 = req.body.password1;
               let p2 = req.body.password2;
               if (p1 == p2){
                   User.updateOne({email: email}, {$set:{password: bcrypt.hashSync(p1, bcrypt.genSaltSync(5), null)}});
                   res.redirect('/user/signin');
               }
            }
        });
    }
    //Posts the signin form | Will redirect to login protected pages if you were trying yo acces them.
    this.postSignin = function(req, res, next){
        let id = req.user.id;
        User.findById(id, function(err, user){
            if(err){
                res.write(err);
            }
            else{
                if(user.activated == true){
                    if (req.session.oldUrl){
                        var oldUrl = req.session.oldUrl;
                        req.session.oldUrl = null;
                        res.redirect(oldUrl);
                    }
                    else{
                        res.redirect('/')
                    }
                }
                else{
                    res.render('/verification')
                }
            }
        });
    };
    //Posts the remove product request
    this.postRemoveProduct = function(req, res, next){
        var id = req.params.id;
        Product.findByIdAndRemove(id, function(err, result){
            if(err){
                res.write(err);
            }
            else{
                res.redirect('/admin/removeproduct');
            }
        });
    };
    //Post add product
    this.postAddProduct = function(req, res, next){
        product = new Product({
            imagePath: req.body.imagePath,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            productLink: req.body.productLink,
            brand: req.body.brand
        })
        product.save(function(err, result){
            if(err){
                res.write(err);
            }
            else{
                res.redirect('/admin/addproduct');
            }
        });
    };
    //Get the Invoice page 
    this.getInvoice = function(req, res, next){
        var orderId = req.params.id;
        Order.findById(orderId, function(err, order){
            var oUser = order.user.toString();
            var rUser = req.user.id.toString();
            if (err){
                req.flash('error', err.message);
                res.redirect('/user/profile');
            }
            if(oUser === rUser){
                var cart = new Cart(order.cart);
                res.render('user/invoice',{title: config.title_Invoice, order: order, items: cart.items});
            }
            else{
                res.redirect('/');
            }
        });
    };
};