/**
 * Created by awaseem on 15-08-03.
 */

var mongoose= require("mongoose");

var item = mongoose.Schema({
    heading: String,
    headingImage: String,
    body: String,
    image: String,
    website: String,
    git: String
});

module.exports = mongoose.model("item", item);