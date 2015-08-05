/**
 * Created by awaseem on 15-08-04.
 */

var item = require("./item");

var helpers = {};

helpers.addItem = function (formData) {
    var newItem = new item();

    newItem.headingImage = formData.headingImage;
    newItem.heading = formData.heading;
    newItem.body = formData.body;
    newItem.image = formData.image;
    newItem.website = formData.website;
    newItem.git = formData.git;

    newItem.save(function (err) {
        if (err) {
            console.log(err);
        }
    });
};

module.exports = helpers;