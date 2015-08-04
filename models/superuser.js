/**
 * Created by awaseem on 15-08-03.
 */

var mongoose = require("mongoose");
var bcrypt   = require('bcrypt-nodejs');

var superUserSchema = mongoose.Schema({
    user: {
        username: String,
        password: String
    }
});

superUserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

superUserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.user.password);
};

module.exports = mongoose.model("superUser", superUserSchema);