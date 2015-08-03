/**
 * Created by awaseem on 15-07-26.
 */

var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var handleBars = require("express-handlebars");
var configDB = require("./config/database.js");
var htmlDir = path.join(__dirname + "/public/html/");

// configurations for express app
var app = express();
app.use(express.static(__dirname + "/public"));

// Set handles bars as template engine
app.engine("handlebars", handleBars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// bind models to the database url
mongoose.connect(configDB.url);

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/item", function (req, res) {
    res.sendFile(htmlDir + "item.html");
});

app.listen(3000);