/**
 * Created by awaseem on 15-07-26.
 */

var gulp = require("gulp");
var gutil = require("gulp-util");
var gls = require("gulp-live-server");
var inquirer = require("inquirer");
var superUser = require("./models/superuser");
var mongoose = require("mongoose");

gulp.task("createsuperuser", function (done) {
    mongoose.connect(require("./config/database").url);
    inquirer.prompt([{
        type: "input",
        name: "username",
        message: "Enter username: ",
        validate: function (value) {
            var done = this.async();
            superUser.findOne( {"user.username": value}, function (err, user) {
                if (err) {
                    done("Please try again, this following error occurred: " + err);
                    return;
                }
                if (user) {
                    done("User already exists!, please try again!");
                    return;
                }
                done(true);
            })
        }
    },{
        type: "password",
        message: "Enter a password: ",
        name: "password"
    }], function (answers) {
        var newSuperUser = new superUser();

        newSuperUser.user.username = answers.username;
        newSuperUser.user.password = newSuperUser.generateHash(answers.password);

        newSuperUser.save(function (err) {
            if (err) {
                gutil.log("Could not create new user because of the following error " + err);
                mongoose.disconnect();
                done();
            }
            gutil.log("Successfully created new super user!");
            mongoose.disconnect();
            done();
        });
    });
});

gulp.task("deletesuperuser", function (done) {
    mongoose.connect(require("./config/database").url);
    superUser.find({}, "-_id user.username", function (err, users) {
        var choices = [];
        users.forEach(function (value, index, array) {
            choices.push(value.user.username);
        });
        inquirer.prompt([{
            type: "list",
            name: "userToDelete",
            message: "Select user to delete: ",
            choices: choices
        }], function (answers) {
            superUser.remove({ "user.username": answers.userToDelete}, function (err) {
                if (err) {
                    gutil.log("Failed to remove username because of the following error: " + err);
                    mongoose.disconnect();
                    done();
                }
                gutil.log("Successfully deleted user!");
                mongoose.disconnect();
                done();
            });
        });
    });
});

gulp.task("serve", function () {
    var server = gls.new("app.js");
    server.start();

    gulp.watch(["public/**/*.html", "public/**/*.css", "public/**/*.js"], function () {
        server.notify.apply(server, arguments);
    });

    gulp.watch("views/**/*.handlebars", function () {
        server.notify.apply(server, arguments);
    });

    gulp.watch("app.js", server.start.bind(server));
});