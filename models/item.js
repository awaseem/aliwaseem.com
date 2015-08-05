/**
 * Created by awaseem on 15-08-03.
 */

var mongoose= require("mongoose");

var item = mongoose.Schema({
    heading: String,
    body: String,
    images: String
});

module.exports = mongoose.model("item", item);