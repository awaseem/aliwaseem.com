/**
 * Created by awaseem on 15-07-26.
 */

var express = require("express");
var path = require("path");
var htmlDir = path.join(__dirname + "/public/html/");

var app = express();
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
    res.sendFile(htmlDir + "index.html");
});

app.listen(3000);
