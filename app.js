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
var fileStore = require("session-file-store")(session);
var passport = require("passport");
var flash = require("connect-flash");
var winston = require("winston");
var configDB = require("./config/database.js");

// configurations for express app
var app = express();

// Set static files locations
app.use(express.static(__dirname + "/public"));

var transports = [];

if (app.get("env") == "production" ) {
    transports.push(new winston.transports.File({
        filename: "error.log",
        timeStamp: true
    }))
}
else {
    transports.push(new winston.transports.Console())
}

// Setup logger
var logger = new (winston.Logger)({
    transports: transports
});

// bind models to the database url
mongoose.connect(configDB.url);

require("./config/passport")(passport);

// Set handles bars as template engine
app.set("views", __dirname + "/views");
var hbs = handleBars.create({
    layoutsDir: path.join(app.settings.views, "layouts"),
    defaultLayout: "main",
    helpers: {
        replaceBreak: function (str) {
            return str.replace(/<br\s*\/?>/mg,"\n");
        }
    }
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Passport local login setup
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(session({
    store: new fileStore({
        ttl: 300,
        logFn: logger.info
    }),
    secret: 'test',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require("./routes/route")(app, passport);

app.use(function (err, req, res, next) {
    logger.error(err.stack);
    res.render("error", { layout: "blank" });
});

app.listen(3000);