/**
 * Created by awaseem on 15-07-26.
 */

var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var handleBars = require("express-handlebars");
var session = require("express-session");
var passport = require("passport");
var flash = require("connect-flash");
var configDB = require("./config/database.js");

// configurations for express app
var app = express();

// Set static files locations
var htmlDir = path.join(__dirname + "/public/html/");
app.use(express.static(__dirname + "/public"));

// bind models to the database url
mongoose.connect(configDB.url);

require("./config/passport")(passport);

// Set handles bars as template engine
app.engine("handlebars", handleBars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Passport local login setup
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/item", function (req, res) {
    res.sendFile(htmlDir + "item.html");
});

app.get("/login", function (req, res) {
    res.render("login", {
        messages: req.flash("loginMessage")
    });
});

app.post("/login", passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

app.listen(3000);