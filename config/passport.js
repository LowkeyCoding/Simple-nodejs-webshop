var passport = require('passport');
var User = require('../models/user');
var emailHandler = require('../scriptPartials/emailHandler');
var LocalStrategy = require('passport-local').Strategy;
var eHandler = new emailHandler()
passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});
    var errors = req.validationErrors();
    if (errors){
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email},function(err, user){
        if (err) {
            return done(err);
        }
        if (user){
            done(null, false, {message:'Email already in use.'});
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.activated = false;
        newUser.save(function(err, result){
            if (err){
                return done(err);
            }
            let id = result._id;
            let email = result.email;
            let hostname = req.hostname;
            eHandler.sendConfirmation(id, email, hostname)
            return done(null,null,{message: "Account not activated, please check you're email"});
        });
    });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: 'No user found.'});
        }
        if (!user.validPassword(password)) {
            return done(null, false, {message: 'Wrong password.'});
        }
        if (user.activated != true) {
            return done(null, false, {message: "Account not activated, please check you're email"});
        }
        return done(null, user);
    });
}));