/**
 * Created by awaseem on 15-08-03.
 */

var local = require("passport-local").Strategy;

var superUser = require("../models/superuser");

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        superUser.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use("local-login", new local({
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true
    }, function (req, username, password, done) {
        superUser.findOne({ "user.username": username }, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, req.flash("loginMessage", "No user found!"));
            }

            if (!user.validPassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            }
            return done(null, user);
        })
    }));
};
