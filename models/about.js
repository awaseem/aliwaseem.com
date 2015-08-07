/**
 * Created by awaseem on 15-08-03.
 */

var mongoose= require("mongoose");

var about = mongoose.Schema({
    body: String
});

module.exports = mongoose.model("about", about);
